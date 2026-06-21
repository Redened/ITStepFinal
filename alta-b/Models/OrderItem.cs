using ALTA.Common.Entities;

namespace ALTA.Models
{
    public class OrderItem : Entity
    {
        public int Quantity { get; set; }

        // Unit price captured at the time of purchase (snapshot).
        public double Price { get; set; }

        // Relation with order (one to many)
        public int OrderId { get; set; }
        public Order Order { get; set; }

        // Relation with product (one to many)
        public int ProductId { get; set; }
        public Product Product { get; set; }
    }
}
