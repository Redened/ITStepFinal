using VAPE.DTOs.Requests;
using FluentValidation;

namespace VAPE.Validators.Categories
{
    public class UpdateCategoryValidator : AbstractValidator<UpdateCategoryRequest>
    {
        public UpdateCategoryValidator()
        {
            When(x => x.Name is not null, () =>
                RuleFor(x => x.Name).MinimumLength(2).MaximumLength(60));
        }
    }
}
