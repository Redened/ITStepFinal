using ALTA.Common.Entities;

namespace ALTA.Models
{
    public class Address : Entity
    {
        public string Title { get; set; }        // e.g. "Home", "Work"
        public string FullName { get; set; }
        public string Line { get; set; }          // street address
        public string City { get; set; }
        public string? PostalCode { get; set; }
        public bool IsDefault { get; set; }

        // Relation with user (one to many)
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
