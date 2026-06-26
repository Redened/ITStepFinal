using VAPE.Common.DTOs.Requests;
using VAPE.Common.DTOs.Responses;
using VAPE.Common.Results;
using VAPE.DTOs.Requests;
using VAPE.DTOs.Responses;

namespace VAPE.Services.Products
{
    public interface IProductServices
    {
        Result<Paged<ProductResponse>> GetProducts(PagedRequest req);
        Result<Paged<ProductResponse>> FilterProducts(FilterProductsRequest req);
        Result<ProductDetailsResponse> GetProductDetails(int productId);

    }
}
