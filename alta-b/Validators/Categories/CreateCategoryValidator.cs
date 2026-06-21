using ALTA.DTOs.Requests;
using FluentValidation;

namespace ALTA.Validators.Categories
{
    public class CreateCategoryValidator : AbstractValidator<CreateCategoryRequest>
    {
        public CreateCategoryValidator()
        {
            RuleFor(x => x.Name).NotEmpty().MinimumLength(2).MaximumLength(60);
        }
    }
}
