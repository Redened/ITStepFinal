using ALTA.DTOs.Requests;
using FluentValidation;

namespace ALTA.Validators.Products
{
    public class UpdateProductValidator : AbstractValidator<UpdateProductRequest>
    {
        public UpdateProductValidator()
        {
            When(x => x.Title is not null, () =>
                RuleFor(x => x.Title).MinimumLength(2).MaximumLength(120));

            When(x => x.Description is not null, () =>
                RuleFor(x => x.Description).MaximumLength(2000));

            When(x => x.Stock.HasValue, () =>
                RuleFor(x => x.Stock!.Value).GreaterThanOrEqualTo(0));

            When(x => x.Price.HasValue, () =>
                RuleFor(x => x.Price!.Value).GreaterThan(0));

            When(x => x.CategoryId.HasValue, () =>
                RuleFor(x => x.CategoryId!.Value).GreaterThan(0));
        }
    }
}
