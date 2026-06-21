namespace ALTA.DTOs.Responses
{
    public class CartItemResponse
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        public ProductResponse Product { get; set; }
    }
}
