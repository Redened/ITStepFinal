using ALTA.Common.DTOs.Requests;
using ALTA.Common.DTOs.Responses;
using ALTA.Common.Results;
using ALTA.DTOs.Requests;
using ALTA.DTOs.Responses;
using ALTA.Services.Products;
using Microsoft.AspNetCore.Mvc;

namespace ALTA.Controllers
{
    [Route("api/products"), ApiController]
    [ProducesErrorResponseType(typeof(Result<int>))]
    public class ProductsController : ControllerBase
    {
        private readonly IProductServices _products;

        public ProductsController(IProductServices products) => _products = products;

        [HttpGet]
        [ProducesResponseType<Result<Paged<ProductResponse>>>(200)]
        public IActionResult GetProducts([FromQuery] PagedRequest req)
        {
            var result = _products.GetProducts(req);

            return StatusCode(result.Status, result);
        }

        [HttpGet("filter")]
        [ProducesResponseType<Result<Paged<ProductResponse>>>(200)]
        public IActionResult Filter([FromQuery] FilterProductsRequest req)
        {
            var result = _products.FilterProducts(req);

            return StatusCode(result.Status, result);
        }

        [HttpGet("{productId}")]
        [ProducesResponseType<Result<ProductDetailsResponse>>(200)]
        public IActionResult GetProductById(int productId)
        {
            var result = _products.GetProductDetails(productId);

            return StatusCode(result.Status, result);
        }
    }
}
