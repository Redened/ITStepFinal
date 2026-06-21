using ALTA.Common.DTOs.Requests;
using ALTA.Common.DTOs.Responses;
using ALTA.Common.Results;
using ALTA.DTOs.Requests;
using ALTA.DTOs.Responses;

namespace ALTA.Services.Products
{
    public interface IProductServices
    {
        Result<Paged<ProductResponse>> GetProducts(PagedRequest req);
        Result<Paged<ProductResponse>> FilterProducts(FilterProductsRequest req);
        Result<ProductDetailsResponse> GetProductDetails(int productId);

    }
}
