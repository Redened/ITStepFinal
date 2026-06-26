using VAPE.DTOs.Requests;
using FluentValidation;

namespace VAPE.Validators.Cart
{
    public class AddToCartValidator : AbstractValidator<AddToCartDto>
    {
        public AddToCartValidator()
        {
            RuleFor(x => x.ProductId).GreaterThan(0);

            RuleFor(x => x.Quantity).GreaterThan(0);
        }
    }
}
