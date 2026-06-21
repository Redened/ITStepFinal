using ALTA.Common.DTOs.Requests;
using ALTA.Data;
using ALTA.DTOs.Requests;
using ALTA.Enums;
using ALTA.Models;
using ALTA.Services.Orders;
using Xunit;

namespace ALTA.Tests
{
    public class OrderServicesTests
    {
        private static OrderServices CreateSut(DataContext db) =>
            new OrderServices(db, TestHelpers.CreateMapper());

        private static (DataContext db, int userId, int productId) SeedUserWithCart(int stock, int quantity)
        {
            var db = TestHelpers.NewContext();

            var user = new User("buyer", "buyer@test.com", "hash");
            db.Users.Add(user);

            var category = new Category { Name = "Cat", ImageUrl = "img" };
            db.Categories.Add(category);
            db.SaveChanges();

            var product = new Product
            {
                Title = "Widget",
                Description = "desc",
                Image = "img",
                Price = 10,
                Stock = stock,
                CategoryId = category.Id
            };
            db.Products.Add(product);
            db.SaveChanges();

            db.CartItems.Add(new CartItem { UserId = user.Id, ProductId = product.Id, Quantity = quantity });
            db.SaveChanges();

            return (db, user.Id, product.Id);
        }

        [Fact]
        public void Checkout_WithEmptyCart_ReturnsBadRequest()
        {
            var db = TestHelpers.NewContext();
            var user = new User("u", "u@test.com", "h");
            db.Users.Add(user);
            db.SaveChanges();

            var result = CreateSut(db).Checkout(user.Id, new CheckoutRequest());

            Assert.Equal(400, result.Status);
        }

        [Fact]
        public void Checkout_WhenStockInsufficient_ReturnsBadRequestAndDoesNotCreateOrder()
        {
            var (db, userId, _) = SeedUserWithCart(stock: 1, quantity: 5);

            var result = CreateSut(db).Checkout(userId, new CheckoutRequest());

            Assert.Equal(400, result.Status);
            Assert.Empty(db.Orders);
        }

        [Fact]
        public void Checkout_WithValidCart_CreatesOrderDecrementsStockAndClearsCart()
        {
            var (db, userId, productId) = SeedUserWithCart(stock: 10, quantity: 3);

            var result = CreateSut(db).Checkout(userId, new CheckoutRequest());

            Assert.Equal(200, result.Status);
            Assert.Single(db.Orders);
            Assert.Empty(db.CartItems);
            Assert.Equal(7, db.Products.Single(p => p.Id == productId).Stock);
        }

        [Fact]
        public void Checkout_SnapshotsItemPriceAndOrderTotal()
        {
            var (db, userId, productId) = SeedUserWithCart(stock: 10, quantity: 3);
            // Product price is 10 (from SeedUserWithCart).

            var orderId = CreateSut(db).Checkout(userId, new CheckoutRequest
            {
                ShippingAddress = "1 Test St",
                PaymentMethod = "Card"
            }).Value;

            var order = db.Orders.Single(o => o.Id == orderId);
            var item = db.OrderItems.Single();

            Assert.Equal(10, item.Price);          // snapshot of product price
            Assert.Equal(30, order.TotalAmount);   // 3 * 10
            Assert.Equal("1 Test St", order.ShippingAddress);
            Assert.Equal("Card", order.PaymentMethod);
        }

        [Fact]
        public void CancelOrder_WhenPending_RestoresStockAndSetsCancelled()
        {
            var (db, userId, productId) = SeedUserWithCart(stock: 10, quantity: 4);
            var sut = CreateSut(db);
            var checkout = sut.Checkout(userId, new CheckoutRequest());
            var orderId = checkout.Value;

            var result = sut.CancelOrder(userId, orderId);

            Assert.Equal(200, result.Status);
            Assert.Equal(OrderStatus.Cancelled, db.Orders.Single().Status);
            Assert.Equal(10, db.Products.Single(p => p.Id == productId).Stock);
        }

        [Fact]
        public void ConfirmOrder_WhenPending_SetsConfirmed()
        {
            var (db, userId, _) = SeedUserWithCart(stock: 10, quantity: 2);
            var sut = CreateSut(db);
            var orderId = sut.Checkout(userId, new CheckoutRequest()).Value;

            var result = sut.ConfirmOrder(userId, orderId);

            Assert.Equal(200, result.Status);
            Assert.Equal(OrderStatus.Confirmed, db.Orders.Single().Status);
        }

        [Fact]
        public void ConfirmOrder_WhenNotPending_ReturnsBadRequest()
        {
            var (db, userId, _) = SeedUserWithCart(stock: 10, quantity: 2);
            var sut = CreateSut(db);
            var orderId = sut.Checkout(userId, new CheckoutRequest()).Value;
            sut.ConfirmOrder(userId, orderId);

            var second = sut.ConfirmOrder(userId, orderId);

            Assert.Equal(400, second.Status);
        }

        [Fact]
        public void CancelOrder_ForOtherUser_ReturnsNotFound()
        {
            var (db, userId, _) = SeedUserWithCart(stock: 10, quantity: 2);
            var sut = CreateSut(db);
            var orderId = sut.Checkout(userId, new CheckoutRequest()).Value;

            var result = sut.CancelOrder(userId + 999, orderId);

            Assert.Equal(404, result.Status);
        }
    }
}
