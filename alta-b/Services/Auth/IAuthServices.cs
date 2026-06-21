using ALTA.Common.Results;
using ALTA.DTOs.Requests;
using ALTA.DTOs.Responses;

namespace ALTA.Services.Auth
{
    public interface IAuthServices
    {
        Result<int> Register(RegisterRequest req);
        Result<TokenResponse> Login(LoginRequest req);
        Result<TokenResponse> VerifyEmail(VerifyEmailRequest req);
        Result<int> ForgotPassword(string email);
        Result<int> ResetPassword(ResetPasswordRequest req);
    }
}
