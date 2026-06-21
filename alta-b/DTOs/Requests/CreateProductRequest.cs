using ALTA.Enums;

namespace ALTA.DTOs.Requests
{
    public class CreateProductRequest
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public int Stock { get; set; }
        public double Price { get; set; }
        public string Image { get; set; }
        public List<string> Gallery { get; set; } = new();
        public int CategoryId { get; set; }
        public ProductStatus Status { get; set; } = ProductStatus.Active;
        public double? Discount { get; set; }
    }
}
