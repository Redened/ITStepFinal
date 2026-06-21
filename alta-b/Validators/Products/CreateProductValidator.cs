using ALTA.DTOs.Requests;
using FluentValidation;

namespace ALTA.Validators.Products
{
    public class CreateProductValidator : AbstractValidator<CreateProductRequest>
    {
        public CreateProductValidator()
        {
            RuleFor(x => x.Title).NotEmpty().MinimumLength(2).MaximumLength(120);

            RuleFor(x => x.Description).NotEmpty().MaximumLength(2000);

            RuleFor(x => x.Stock).GreaterThanOrEqualTo(0);

            RuleFor(x => x.Price).GreaterThan(0);

            RuleFor(x => x.Image).NotEmpty();

            RuleFor(x => x.CategoryId).GreaterThan(0);
        }
    }
}
