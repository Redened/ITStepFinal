using VAPE.Enums;

namespace VAPE.DTOs.Requests
{
    public class UpdateProductRequest
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public int? Stock { get; set; }
        public double? Price { get; set; }
        public string? Image { get; set; }
        public List<string>? Gallery { get; set; }
        public int? CategoryId { get; set; }
        public ProductStatus? Status { get; set; }
        public double? Discount { get; set; }
    }
}
