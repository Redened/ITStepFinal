using VAPE.Common.DTOs.Requests;
using VAPE.Common.DTOs.Responses;
using VAPE.Common.Results;
using VAPE.Data;
using VAPE.DTOs.Requests;
using VAPE.DTOs.Responses;
using VAPE.Enums;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace VAPE.Services.Products
{
    public class ProductServices : IProductServices
    {
        private readonly DataContext _db;
        private readonly IMapper _mapper;

        public ProductServices(DataContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        public Result<Paged<ProductResponse>> GetProducts(PagedRequest req)
        {
            var baseQuery = _db.Products.Where(p => p.Status == ProductStatus.Active);

            var products = baseQuery
                .Skip((req.Page - 1) * req.Take).Take(req.Take)
                .ProjectTo<ProductResponse>(_mapper.ConfigurationProvider)
                .ToList();

            var totalCount = baseQuery.Count();

            var result = new Paged<ProductResponse>(
                products, totalCount, req.Page, req.Take);

            return Result<Paged<ProductResponse>>.Ok(result);
        }

        public Result<Paged<ProductResponse>> FilterProducts(FilterProductsRequest req)
        {
            var query = _db.Products.Where(p => p.Status == ProductStatus.Active);

            if (req.CategoryId.HasValue)
                query = query.Where(p => p.CategoryId == req.CategoryId);

            if (!string.IsNullOrWhiteSpace(req.Query))
            {
                string q = req.Query.ToLower();

                query = query.Where(p =>
                p.Title.ToLower().Contains(q) || p.Description.ToLower().Contains(q));
            }

            if (req.MinPrice.HasValue)
                query = query.Where(p => p.Price >= req.MinPrice);

            if (req.MaxPrice.HasValue)
                query = query.Where(p => p.Price <= req.MaxPrice);

            var totalCount = query.Count();

            var products = query
                .Skip((req.Page - 1) * req.Take).Take(req.Take)
                .ProjectTo<ProductResponse>(_mapper.ConfigurationProvider)
                .ToList();

            var result = new Paged<ProductResponse>(
                products, totalCount, req.Page, req.Take);

            return Result<Paged<ProductResponse>>.Ok(result);
        }

        public Result<ProductDetailsResponse> GetProductDetails(int productId)
        {
            var product = _db.Products
                .ProjectTo<ProductDetailsResponse>(_mapper.ConfigurationProvider)
                .FirstOrDefault(p => p.Id == productId);

            if (product == null)
                return Result<ProductDetailsResponse>.NotFound("Product not found.");


            return Result<ProductDetailsResponse>.Ok(product);
        }
    }
}
