using ALTA.DTOs.Requests;
using FluentValidation;

namespace ALTA.Validators.Users
{
    public class EditUserValidator : AbstractValidator<EditUserRequest>
    {
        public EditUserValidator()
        {
            When(x => !string.IsNullOrWhiteSpace(x.PhoneNumber), () =>
            {
                RuleFor(x => x.PhoneNumber).MinimumLength(7).MaximumLength(9);
            });

            When(x => !string.IsNullOrWhiteSpace(x.Username), () =>
            {
                RuleFor(x => x.Username).MinimumLength(3).MaximumLength(60);
            });

            When(x => !string.IsNullOrWhiteSpace(x.Address), () =>
            {
                RuleFor(x => x.Address).MinimumLength(4).MaximumLength(70);
            });
        }
    }
}
