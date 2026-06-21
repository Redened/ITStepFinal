using ALTA.Common.Entities;

namespace ALTA.Models
{
    public class WishlistItem : Entity
    {
        // Relation with user (one to many)
        public int UserId { get; set; }
        public User User { get; set; }

        // Relation with product (one to many)
        public int ProductId { get; set; }
        public Product Product { get; set; }
    }
}
