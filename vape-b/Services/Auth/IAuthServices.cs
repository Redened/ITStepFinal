using VAPE.Common.Results;
using VAPE.DTOs.Requests;
using VAPE.DTOs.Responses;

namespace VAPE.Services.Auth
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
