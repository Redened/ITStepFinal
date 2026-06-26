using VAPE.DTOs.Requests;
using FluentValidation;

namespace VAPE.Validators.Auth
{
    public class RegisterValidator : AbstractValidator<RegisterRequest>
    {
        public RegisterValidator()
        {
            RuleFor(x => x.Email).EmailAddress();
            
            RuleFor(x => x.Username).MinimumLength(3).MaximumLength(60);

            RuleFor(x => x.Password).MinimumLength(6).MaximumLength(50);
        }
    }
}
