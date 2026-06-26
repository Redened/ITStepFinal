using VAPE.Common.Results;
using VAPE.Common.Services;
using VAPE.Common.Validation;
using VAPE.Data;
using VAPE.DTOs.Requests;
using VAPE.DTOs.Responses;
using VAPE.Models;
using FluentValidation;

namespace VAPE.Services.Auth
{
    public class AuthServices : IAuthServices
    {
        private readonly DataContext _db;
        private readonly SmtpServices _smtp;
        private readonly JwtService _jwt;
        private readonly IValidator<RegisterRequest> _registerValidator;
        private readonly IValidator<LoginRequest> _loginValidator;
        private readonly IValidator<ResetPasswordRequest> _resetPasswordValidator;

        public AuthServices(
            DataContext db,
            SmtpServices smtp,
            JwtService jwt,
            IValidator<RegisterRequest> registerValidator,
            IValidator<LoginRequest> loginValidator,
            IValidator<ResetPasswordRequest> resetPasswordValidator)
        {
            _db = db;
            _smtp = smtp;
            _jwt = jwt;
            _registerValidator = registerValidator;
            _loginValidator = loginValidator;
            _resetPasswordValidator = resetPasswordValidator;
        }

        public Result<int> Register(RegisterRequest req)
        {
            var errors = _registerValidator.GetErrors(req);

            if (errors != null)
                return Result<int>.ValidationError(errors);

            if (_db.Users.Any(u => u.Email == req.Email))
                return Result<int>.BadRequest("user already exists.");

            string hash = BCrypt.Net.BCrypt.HashPassword(req.Password);

            User user = new User(req.Username, req.Email, hash);

            Random rand = new Random();
            user.VerificationCode = rand.Next(100_000, 999_999).ToString();

            _db.Users.Add(user);
            _db.SaveChanges();

            string body = $"Verification code: {user.VerificationCode}";

            _smtp.SendEmail("Email verification", user.Email, body);

            return Result<int>.Ok(user.Id);
        }
        public Result<TokenResponse> Login(LoginRequest req)
        {
            var errors = _loginValidator.GetErrors(req);

            if (errors != null)
                return Result<TokenResponse>.ValidationError(errors);

            var user = _db.Users.FirstOrDefault(u => u.Email == req.Email);

            if (user == null)
                return Result<TokenResponse>.BadRequest("email or password is not correct.");

            if (!BCrypt.Net.BCrypt.Verify(req.Password, user.Password))
                return Result<TokenResponse>.BadRequest("email or password is not correct.");

            if (!user.IsVerified)
            {
                Random rand = new Random();
                user.VerificationCode = rand.Next(100_000, 999_999).ToString();

                _db.SaveChanges();

                string body = $"Verification code: {user.VerificationCode}";

                _smtp.SendEmail("Email verification", user.Email, body);

                return Result<TokenResponse>.Ok(new TokenResponse("Verification"));
            }

            string accessToken = _jwt.GenerateJwtToken(user);

            return Result<TokenResponse>.Ok(new TokenResponse(accessToken));
        }
        public Result<TokenResponse> VerifyEmail(VerifyEmailRequest req)
        {
            var user = _db.Users.FirstOrDefault(u => u.Email == req.Email);

            if (user == null)
                return Result<TokenResponse>.NotFound("user not found.");

            if (user.VerificationCode != req.Code)
                return Result<TokenResponse>.BadRequest("verification code is not correct.");

            user.IsVerified = true;
            user.VerificationCode = null;

            _db.SaveChanges();

            string accessToken = _jwt.GenerateJwtToken(user);

            return Result<TokenResponse>.Ok(new TokenResponse(accessToken));
        }

        public Result<int> ForgotPassword(string email)
        {
            var user = _db.Users
                .FirstOrDefault(u => u.Email == email);

            if (user == null)
                return Result<int>.BadRequest("if email exists you will get verification code");

            if (!user.IsVerified)
                return Result<int>.BadRequest("if email exists you will get verification code");

            Random rand = new Random();

            user.VerificationCode = rand.Next(100_000, 999_999).ToString();

            _db.SaveChanges();

            string body = $"Verification code: {user.VerificationCode}";

            _smtp.SendEmail("Email verification", user.Email, body);

            return Result<int>.Ok(user.Id);
        }

        public Result<int> ResetPassword(ResetPasswordRequest req)
        {
            var errors = _resetPasswordValidator.GetErrors(req);

            if (errors != null)
                return Result<int>.ValidationError(errors);

            var user = _db.Users
              .FirstOrDefault(u => u.Email == req.Email);

            if (user == null) return Result<int>.NotFound("user not found.");

            if (user.VerificationCode != req.Code)
                return Result<int>.BadRequest("verification code is not correct.");

            user.Password = BCrypt.Net.BCrypt.HashPassword(req.Password);
            user.VerificationCode = null;
            _db.SaveChanges();

            return Result<int>.Ok(user.Id);
        }
    }
}
