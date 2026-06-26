using VAPE.Common.Entities;

namespace VAPE.Models
{
    public class CartItem : Entity
    {
        public int Quantity { get; set; }

        // Relation with user (one to many)
        public int UserId { get; set; }
        public User User { get; set; }

        // Relation with product (one to many)
        public int ProductId { get; set; }
        public Product Product { get; set; }
    }
}
