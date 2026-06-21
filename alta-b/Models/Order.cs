using ALTA.Common.Entities;
using ALTA.Enums;

namespace ALTA.Models
{
    public class Order : Entity
    {
        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        // Order total captured at checkout (sum of item price * quantity).
        public double TotalAmount { get; set; }

        public string? ShippingAddress { get; set; }
        public string? PaymentMethod { get; set; }
        public DeliveryMethod DeliveryMethod { get; set; } = DeliveryMethod.Standard;

        // Relation with user (one to many)
        public int UserId { get; set; }
        public User User { get; set; }

        // Relation with order item (one to many)
        public List<OrderItem> OrderItems { get; set; } = new();
    }
}
