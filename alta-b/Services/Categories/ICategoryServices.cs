using ALTA.Common.Results;
using ALTA.DTOs.Responses;

namespace ALTA.Services.Categories
{
    public interface ICategoryServices
    {
        Result<List<CategoryResponse>> GetCategories();
    }
}
