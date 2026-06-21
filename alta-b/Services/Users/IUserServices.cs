using ALTA.Common.Results;
using ALTA.DTOs.Requests;

using ALTA.DTOs.Responses;

namespace ALTA.Services.Users
{
    public interface IUserServices
    {
        Result<ProfileResponse> GetProfile(int userId);
        Result<int> ChangePassword(int userId, ChangePasswordRequest req);
        Result<int> EditUser(int userId, EditUserRequest req);
        Result<int> Delete(int userId);
    }
}
