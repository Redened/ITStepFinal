using ALTA.Common.Entities;

namespace ALTA.Models
{
    public class Review : Entity
    {
        public int Rating { get; set; }       // 1..5
        public string? Comment { get; set; }

        // Relation with product (one to many)
        public int ProductId { get; set; }
        public Product Product { get; set; }

        // Relation with user (one to many)
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
