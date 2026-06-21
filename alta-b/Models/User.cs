using ALTA.Common.Entities;
using ALTA.Enums;

namespace ALTA.Models
{
    public class User : Entity
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public bool IsVerified { get; set; } = false;
        public string? VerificationCode { get; set; }
        public UserRoles Role { get; set; } = UserRoles.User;

        // Relation with user details (one to one)
        public UserDetails UserDetails { get; set; } = new();

        // Relation with cart item (one to many)
        public List<CartItem> CartItems { get; set; } = new();

        // Relation with order (one to many)
        public List<Order> Orders { get; set; } = new();

        public User() { }

        public User(string username, string email, string pass)
        {
            Username = username;
            Email = email;
            Password = pass;
        }
    }
}
