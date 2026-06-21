using ALTA.DTOs.Requests;
using ALTA.Validators.Auth;
using ALTA.Validators.Products;
using Xunit;

namespace ALTA.Tests
{
    public class ValidatorTests
    {
        [Theory]
        [InlineData("not-an-email", "user", "password", false)]
        [InlineData("user@test.com", "ab", "password", false)] // username too short
        [InlineData("user@test.com", "user", "123", false)]    // password too short
        [InlineData("user@test.com", "user", "password", true)]
        public void RegisterValidator_ValidatesFields(string email, string username, string password, bool expectedValid)
        {
            var result = new RegisterValidator().Validate(new RegisterRequest
            {
                Email = email,
                Username = username,
                Password = password
            });

            Assert.Equal(expectedValid, result.IsValid);
        }

        [Fact]
        public void CreateProductValidator_RejectsNonPositivePrice()
        {
            var result = new CreateProductValidator().Validate(new CreateProductRequest
            {
                Title = "Widget",
                Description = "desc",
                Image = "img",
                Price = 0,
                Stock = 5,
                CategoryId = 1
            });

            Assert.False(result.IsValid);
        }

        [Fact]
        public void CreateProductValidator_AcceptsValidProduct()
        {
            var result = new CreateProductValidator().Validate(new CreateProductRequest
            {
                Title = "Widget",
                Description = "desc",
                Image = "img",
                Price = 9.99,
                Stock = 5,
                CategoryId = 1
            });

            Assert.True(result.IsValid);
        }
    }
}
