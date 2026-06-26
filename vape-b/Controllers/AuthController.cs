using VAPE.Common.Results;
using VAPE.DTOs.Requests;
using VAPE.DTOs.Responses;
using VAPE.Services.Auth;
using Microsoft.AspNetCore.Mvc;

namespace VAPE.Controllers
{
    [Route("api/auth"), ApiController]
    [ProducesErrorResponseType(typeof(Result<int>))]
    public class AuthController : ControllerBase
    {
        private readonly IAuthServices _auth;

        public AuthController(IAuthServices auth) => _auth = auth;

        [HttpPost("register")]
        public IActionResult Register(RegisterRequest req)
        {
            var result = _auth.Register(req);

            return StatusCode(result.Status, result);
        }

        [HttpPost("login")]
        [ProducesResponseType<Result<TokenResponse>>(200)]
        public IActionResult Login(LoginRequest req)
        {
            var result = _auth.Login(req);

            return StatusCode(result.Status, result);
        }

        [HttpPut("verify-email")]
        [ProducesResponseType<Result<TokenResponse>>(200)]
        public IActionResult Verify(VerifyEmailRequest req)
        {
            var result = _auth.VerifyEmail(req);

            return StatusCode(result.Status, result);
        }

        [HttpPost("forgot-password/{email}")]
        public IActionResult ForgotPassword(string email)
        {
            var result = _auth.ForgotPassword(email);

            return StatusCode(result.Status, result);
        }

        [HttpPut("reset-password")]
        public IActionResult ResetPassword(ResetPasswordRequest req)
        {
            var result = _auth.ResetPassword(req);

            return StatusCode(result.Status, result);
        }
    }
}
