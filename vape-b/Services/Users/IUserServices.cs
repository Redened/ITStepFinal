using VAPE.Common.Results;
using VAPE.DTOs.Requests;

using VAPE.DTOs.Responses;

namespace VAPE.Services.Users
{
    public interface IUserServices
    {
        Result<ProfileResponse> GetProfile(int userId);
        Result<int> ChangePassword(int userId, ChangePasswordRequest req);
        Result<int> EditUser(int userId, EditUserRequest req);
        Result<int> Delete(int userId);
    }
}
