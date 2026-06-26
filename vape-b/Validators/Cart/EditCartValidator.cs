using VAPE.DTOs.Requests;
using FluentValidation;

namespace VAPE.Validators.Cart
{
    public class EditCartValidator : AbstractValidator<EditCartDto>
    {
        public EditCartValidator()
        {
            RuleFor(x => x.ItemId).GreaterThan(0);

            RuleFor(x => x.Quantity).GreaterThan(0);
        }
    }
}
