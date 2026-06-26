using VAPE.Common.Entities;
using VAPE.Enums;

namespace VAPE.Models
{
    public class Order : Entity
    {
        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        // Order total captured at checkout (sum of item price * quantity).
        public double TotalAmount { get; set; }

        public string? ShippingAddress { get; set; }


        // Relation with user (one to many)
        public int UserId { get; set; }
        public User User { get; set; }

        // Relation with order item (one to many)
        public List<OrderItem> OrderItems { get; set; } = new();
    }
}
