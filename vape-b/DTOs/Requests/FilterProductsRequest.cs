using VAPE.Common.DTOs.Requests;

namespace VAPE.DTOs.Requests
{
    public class FilterProductsRequest : PagedRequest
    {
        public string? Query { get; set; }
        public double? MinPrice { get; set; }
        public double? MaxPrice { get; set; }
        public int? CategoryId { get; set; }
    }
}
