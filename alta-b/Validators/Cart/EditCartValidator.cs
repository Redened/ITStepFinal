using ALTA.DTOs.Requests;
using FluentValidation;

namespace ALTA.Validators.Cart
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
