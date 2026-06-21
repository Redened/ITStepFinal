using ALTA.DTOs.Requests;
using FluentValidation;

namespace ALTA.Validators.Auth
{
    public class ResetPasswordValidator : AbstractValidator<ResetPasswordRequest>
    {
        public ResetPasswordValidator()
        {
            RuleFor(x => x.Email).NotEmpty().EmailAddress();

            RuleFor(x => x.Code).NotEmpty();

            RuleFor(x => x.Password).MinimumLength(6).MaximumLength(50);
        }
    }
}
