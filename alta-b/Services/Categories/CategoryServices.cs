using ALTA.Common.Results;
using ALTA.Data;
using ALTA.DTOs.Responses;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace ALTA.Services.Categories
{
    public class CategoryServices : ICategoryServices
    {

        private readonly DataContext _db;
        private readonly IMapper _mapper;

        public CategoryServices(DataContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        public Result<List<CategoryResponse>> GetCategories()
        {
            var response = _db.Categories
                .ProjectTo<CategoryResponse>(_mapper.ConfigurationProvider)
                .ToList();

            return Result<List<CategoryResponse>>.Ok(response);
        }
    }
}
