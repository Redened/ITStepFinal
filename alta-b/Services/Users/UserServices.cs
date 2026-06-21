using ALTA.Common.Results;
using ALTA.Common.Validation;
using ALTA.Data;
using ALTA.DTOs.Requests;
using ALTA.DTOs.Responses;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace ALTA.Services.Users
{
    public class UserServices : IUserServices
    {
        private readonly DataContext _db;
        private readonly IValidator<EditUserRequest> _editUserValidator;
        private readonly IValidator<ChangePasswordRequest> _changePasswordValidator;

        public UserServices(
            DataContext db,
            IValidator<EditUserRequest> editUserValidator,
            IValidator<ChangePasswordRequest> changePasswordValidator)
        {
            _db = db;
            _editUserValidator = editUserValidator;
            _changePasswordValidator = changePasswordValidator;
        }

        public Result<ProfileResponse> GetProfile(int userId)
        {
            var user = _db.Users
                .Include(u => u.UserDetails)
                .FirstOrDefault(u => u.Id == userId && u.IsVerified);

            if (user == null) return Result<ProfileResponse>.Unauthorized();

            return Result<ProfileResponse>.Ok(new ProfileResponse
            {
                Username = user.Username,
                Email = user.Email,
                Address = user.UserDetails?.Address,
                PhoneNumber = user.UserDetails?.PhoneNumber
            });
        }

        public Result<int> ChangePassword(int userId, ChangePasswordRequest req)
        {
            var validationErrors = _changePasswordValidator.GetErrors(req);

            if (validationErrors != null)
                return Result<int>.ValidationError(validationErrors);

            var user = _db.Users
                .FirstOrDefault(u => u.Id == userId && u.IsVerified);

            if (user == null) return Result<int>.Unauthorized();

            if (!BCrypt.Net.BCrypt.Verify(req.OldPassword, user.Password))
                return Result<int>.BadRequest("Old password is not correct! try again.");

            user.Password = BCrypt.Net.BCrypt.HashPassword(req.NewPassword);
            _db.SaveChanges();

            return Result<int>.Ok(user.Id);
        }

        public Result<int> Delete(int userId)
        {
            var user = _db.Users
                           .FirstOrDefault(u => u.Id == userId && u.IsVerified);

            if (user == null) return Result<int>.Unauthorized();

            _db.Users.Remove(user);
            _db.SaveChanges();

            return Result<int>.Ok(user.Id);
        }

        public Result<int> EditUser(int userId, EditUserRequest req)
        {
            var user = _db.Users
                .Include(u => u.UserDetails)
                .FirstOrDefault(u => u.Id == userId && u.IsVerified);

            if (user == null) return Result<int>.Unauthorized();

            var errors = _editUserValidator.GetErrors(req);

            if (errors != null)
                return Result<int>.ValidationError(errors);

            if (!string.IsNullOrWhiteSpace(req.Username))
                user.Username = req.Username;

            if (!string.IsNullOrWhiteSpace(req.Address))
                user.UserDetails.Address = req.Address;

            if (!string.IsNullOrWhiteSpace(req.PhoneNumber))
                user.UserDetails.PhoneNumber = req.PhoneNumber;

            _db.SaveChanges();

            return Result<int>.Ok(user.Id);
        }
    }
}
