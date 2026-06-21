using ALTA.Data;
using ALTA.DTOs.Requests;
using ALTA.Models;
using ALTA.Services.Cart;
using ALTA.Validators.Cart;
using Xunit;

namespace ALTA.Tests
{
    public class CartServicesTests
    {
        private static CartServices CreateSut(DataContext db) =>
            new CartServices(db, TestHelpers.CreateMapper(),
                new AddToCartValidator(), new EditCartValidator());

        private static (DataContext db, int userId, int productId) Seed(int stock)
        {
            var db = TestHelpers.NewContext();
            var user = new User("u", "u@test.com", "h");
            db.Users.Add(user);
            var category = new Category { Name = "Cat", ImageUrl = "img" };
            db.Categories.Add(category);
            db.SaveChanges();
            var product = new Product
            {
                Title = "P", Description = "d", Image = "img",
                Price = 5, Stock = stock, CategoryId = category.Id
            };
            db.Products.Add(product);
            db.SaveChanges();
            return (db, user.Id, product.Id);
        }

        [Fact]
        public void AddToCart_WithInvalidQuantity_ReturnsValidationError()
        {
            var (db, userId, productId) = Seed(stock: 10);

            var result = CreateSut(db).AddToCart(userId, new AddToCartDto { ProductId = productId, Quantity = 0 });

            Assert.Equal(400, result.Status);
            Assert.Empty(db.CartItems);
        }

        [Fact]
        public void AddToCart_WhenProductMissing_ReturnsNotFound()
        {
            var (db, userId, _) = Seed(stock: 10);

            var result = CreateSut(db).AddToCart(userId, new AddToCartDto { ProductId = 9999, Quantity = 1 });

            Assert.Equal(404, result.Status);
        }

        [Fact]
        public void AddToCart_SameProductTwice_MergesQuantity()
        {
            var (db, userId, productId) = Seed(stock: 10);
            var sut = CreateSut(db);

            sut.AddToCart(userId, new AddToCartDto { ProductId = productId, Quantity = 2 });
            sut.AddToCart(userId, new AddToCartDto { ProductId = productId, Quantity = 3 });

            var item = Assert.Single(db.CartItems);
            Assert.Equal(5, item.Quantity);
        }

        [Fact]
        public void DeleteCartItem_RemovesItem()
        {
            var (db, userId, productId) = Seed(stock: 10);
            var sut = CreateSut(db);
            sut.AddToCart(userId, new AddToCartDto { ProductId = productId, Quantity = 1 });
            var itemId = db.CartItems.Single().Id;

            var result = sut.DeleteCartItem(itemId, userId);

            Assert.Equal(200, result.Status);
            Assert.Empty(db.CartItems);
        }
    }
}
