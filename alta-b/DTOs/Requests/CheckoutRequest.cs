using ALTA.Enums;

namespace ALTA.DTOs.Requests
{
    public class CheckoutRequest
    {
        public string? ShippingAddress { get; set; }
        public string? PaymentMethod { get; set; }
        public DeliveryMethod DeliveryMethod { get; set; } = DeliveryMethod.Standard;
    }
}
