using VAPE.Common.Entities;

namespace VAPE.Models
{
    public class UserDetails : Entity
    {
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }

        // Relation with user (one to one)
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
