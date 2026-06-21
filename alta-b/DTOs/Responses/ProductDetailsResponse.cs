using ALTA.Enums;

namespace ALTA.DTOs.Responses
{
    public class ProductDetailsResponse
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int Stock { get; set; }
        public double Price { get; set; }
        public double? Discount { get; set; }
        public ProductStatus Status { get; set; }
        public double AverageRating { get; set; }
        public int ReviewCount { get; set; }

        public string Image { get; set; }
        public List<string> Gallery { get; set; } = new();
        public CategoryResponse Category { get; set; }

        public double DiscountedPrice =>
            Discount.HasValue ? Math.Round(Price * (1 - Discount.Value / 100.0), 2) : Price;
    }
}
