using ALTA.Common.DTOs.Requests;

namespace ALTA.DTOs.Requests
{
    public class FilterProductsRequest : PagedRequest
    {
        public string? Query { get; set; }
        public double? MinPrice { get; set; }
        public double? MaxPrice { get; set; }
        public int? CategoryId { get; set; }
    }
}
