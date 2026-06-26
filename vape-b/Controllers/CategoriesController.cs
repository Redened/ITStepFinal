using VAPE.Common.DTOs.Responses;
using VAPE.Common.Results;
using VAPE.DTOs.Responses;
using VAPE.Services.Categories;
using Microsoft.AspNetCore.Mvc;

namespace VAPE.Controllers
{
    [Route("api/categories"), ApiController]
    [ProducesErrorResponseType(typeof(Result<int>))]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryServices _category;

        public CategoriesController(ICategoryServices category) => _category = category;

        [HttpGet]
        [ProducesResponseType<Result<List<CategoryResponse>>>(200)]
        public IActionResult Get()
        {
            var result = _category.GetCategories();

            return StatusCode(result.Status, result);
        }
    }
}
