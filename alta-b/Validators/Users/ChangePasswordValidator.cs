using ALTA.DTOs.Requests;
using FluentValidation;

namespace ALTA.Validators.Users
{
    public class ChangePasswordValidator : AbstractValidator<ChangePasswordRequest>
    {
        public ChangePasswordValidator()
        {
            RuleFor(x => x.OldPassword).NotEmpty();

            RuleFor(x => x.NewPassword).MinimumLength(6).MaximumLength(50);
        }
    }
}
