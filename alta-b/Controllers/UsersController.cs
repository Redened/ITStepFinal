using ALTA.Common.Results;
using ALTA.DTOs.Requests;
using ALTA.DTOs.Responses;
using ALTA.Services.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ALTA.Controllers
{
    [Route("api/users"), ApiController, Authorize]
    [ProducesErrorResponseType(typeof(Result<int>))]
    public class UsersController : ControllerBase
    {
        private readonly IUserServices _user;

        public UsersController(IUserServices user) => _user = user;

        [HttpGet("profile")]
        [ProducesErrorResponseType(typeof(Result<ProfileResponse>))]
        public IActionResult GetProfile()
        {
            var claimUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(claimUserId, out int userId)) return Unauthorized();

            var result = _user.GetProfile(userId);

            return StatusCode(result.Status, result);
        }

        [HttpPut("change-password")]
        public IActionResult ChangePassword(ChangePasswordRequest req)
        {
            var claimUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(claimUserId, out int userId)) return Unauthorized();

            var result = _user.ChangePassword(userId, req);

            return StatusCode(result.Status, result);
        }

        [HttpPut("edit")]
        public IActionResult Edit(EditUserRequest req)
        {
            var claimUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(claimUserId, out int userId)) return Unauthorized();

            var result = _user.EditUser(userId, req);

            return StatusCode(result.Status, result);
        }


        [HttpDelete]
        public IActionResult Delete()
        {
            var claimUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(claimUserId, out int userId)) return Unauthorized();

            var result = _user.Delete(userId);

            return StatusCode(result.Status, result);
        }
    }
}
