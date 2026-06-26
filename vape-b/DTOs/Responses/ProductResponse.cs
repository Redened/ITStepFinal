using VAPE.Enums;

namespace VAPE.DTOs.Responses
{
    public class ProductResponse
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int Stock { get; set; }
        public double Price { get; set; }
        public double? Discount { get; set; }
        public string Image { get; set; }
        public ProductStatus Status { get; set; }
        public double AverageRating { get; set; }
        public int ReviewCount { get; set; }

        // Effective price after applying any discount.
        public double DiscountedPrice =>
            Discount.HasValue ? Math.Round(Price * (1 - Discount.Value / 100.0), 2) : Price;
    }
}
