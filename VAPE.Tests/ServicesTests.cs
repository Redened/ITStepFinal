using VAPE.Common.DTOs.Requests;
using VAPE.Data;
using VAPE.DTOs.Requests;
using VAPE.Models;
using VAPE.Services.Reviews;
using VAPE.Services.Wishlist;
using Xunit;

namespace VAPE.Tests
{
    public class ServicesTests
    {
        private static (DataContext db, int userId, int productId) Seed()
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
                Price = 5, Stock = 10, CategoryId = category.Id
            };
            db.Products.Add(product);
            db.SaveChanges();
            return (db, user.Id, product.Id);
        }

        // ─── Wishlist ───────────────────────────────────────────────────────────

        [Fact]
        public void AddToWishlist_IsIdempotent()
        {
            var (db, userId, productId) = Seed();
            var sut = new WishlistServices(db, TestHelpers.CreateMapper());

            sut.AddToWishlist(userId, new AddWishlistRequest { ProductId = productId });
            sut.AddToWishlist(userId, new AddWishlistRequest { ProductId = productId });

            Assert.Single(db.WishlistItems);
        }

        [Fact]
        public void RemoveFromWishlist_RemovesItem()
        {
            var (db, userId, productId) = Seed();
            var sut = new WishlistServices(db, TestHelpers.CreateMapper());
            sut.AddToWishlist(userId, new AddWishlistRequest { ProductId = productId });

            var result = sut.RemoveFromWishlist(userId, productId);

            Assert.Equal(200, result.Status);
            Assert.Empty(db.WishlistItems);
        }

        [Fact]
        public void AddToWishlist_MissingProduct_ReturnsNotFound()
        {
            var (db, userId, _) = Seed();
            var sut = new WishlistServices(db, TestHelpers.CreateMapper());

            var result = sut.AddToWishlist(userId, new AddWishlistRequest { ProductId = 9999 });

            Assert.Equal(404, result.Status);
        }

        // ─── Reviews ────────────────────────────────────────────────────────────

        [Theory]
        [InlineData(0, false)]
        [InlineData(6, false)]
        [InlineData(1, true)]
        [InlineData(5, true)]
        public void CreateReview_ValidatesRatingRange(int rating, bool expectedOk)
        {
            var (db, userId, productId) = Seed();
            var sut = new ReviewServices(db, TestHelpers.CreateMapper());

            var result = sut.CreateReview(userId, new CreateReviewRequest
            {
                ProductId = productId,
                Rating = rating,
                Comment = "ok"
            });

            Assert.Equal(expectedOk, result.Status is 200 or 201);
        }

        [Fact]
        public void CreateReview_SecondReviewBySameUser_UpdatesInsteadOfDuplicating()
        {
            var (db, userId, productId) = Seed();
            var sut = new ReviewServices(db, TestHelpers.CreateMapper());

            sut.CreateReview(userId, new CreateReviewRequest { ProductId = productId, Rating = 3 });
            sut.CreateReview(userId, new CreateReviewRequest { ProductId = productId, Rating = 5 });

            var review = Assert.Single(db.Reviews);
            Assert.Equal(5, review.Rating);
        }
    }
}
