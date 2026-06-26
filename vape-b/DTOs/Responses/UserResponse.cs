using VAPE.Enums;

namespace VAPE.DTOs.Responses
{
    public class UserResponse
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public bool IsVerified { get; set; }
        public UserRoles Role { get; set; }
    }
}
