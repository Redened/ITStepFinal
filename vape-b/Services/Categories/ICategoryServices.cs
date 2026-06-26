using VAPE.Common.Results;
using VAPE.DTOs.Responses;

namespace VAPE.Services.Categories
{
    public interface ICategoryServices
    {
        Result<List<CategoryResponse>> GetCategories();
    }
}
