using VAPE.Enums;

namespace VAPE.DTOs.Responses
{
    public class OrderResponse
    {
        public int Id { get; set; }
        public OrderStatus Status { get; set; }
        public double TotalAmount { get; set; }
        public string? ShippingAddress { get; set; }

        public DateTime CreatedAt { get; set; }

        public List<OrderItemResponse> OrderItems { get; set; }
    }
}