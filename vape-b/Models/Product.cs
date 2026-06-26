using VAPE.Common.Entities;
using VAPE.Enums;

namespace VAPE.Models
{
    public class Product : Entity
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public int Stock { get; set; }
        public double Price { get; set; }

        // Optional discount as a percentage (0–100); null means no discount.
        public double? Discount { get; set; }
        public ProductStatus Status { get; set; } = ProductStatus.Active;

        public string Image { get; set; }
        public List<string> Gallery { get; set; } = new();

        // Relation with category (one to many)
        public int CategoryId { get; set; }
        public Category Category { get; set; }

        // Relation with cart item (one to many)
        public List<CartItem> CartItems { get; set; } = new();

        // Relation with order item (one to many)
        public List<OrderItem> OrderItems { get; set; } = new();

        // Relation with reviews (one to many)
        public List<Review> Reviews { get; set; } = new();
    }
}
