namespace VAPE.DTOs.Responses
{
    public class OrderItemResponse
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        public double Price { get; set; }

        public ProductResponse Product { get; set; }
    }
}
