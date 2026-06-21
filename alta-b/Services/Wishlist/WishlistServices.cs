using ALTA.Common.DTOs.Requests;
using ALTA.Common.DTOs.Responses;
using ALTA.Common.Results;
using ALTA.Data;
using ALTA.DTOs.Requests;
using ALTA.DTOs.Responses;
using ALTA.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace ALTA.Services.Wishlist
{
    public class WishlistServices : IWishlistServices
    {
        private readonly DataContext _db;
        private readonly IMapper _mapper;

        public WishlistServices(DataContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        public Result<int> AddToWishlist(int userId, AddWishlistRequest req)
        {
            if (!_db.Products.Any(p => p.Id == req.ProductId))
                return Result<int>.NotFound("product not found.");

            var existing = _db.WishlistItems
                .FirstOrDefault(w => w.UserId == userId && w.ProductId == req.ProductId);

            if (existing != null)
                return Result<int>.Ok(existing.Id);

            var item = new WishlistItem { UserId = userId, ProductId = req.ProductId };

            _db.WishlistItems.Add(item);
            _db.SaveChanges();

            return Result<int>.Success(201, item.Id);
        }

        public Result<int> RemoveFromWishlist(int userId, int productId)
        {
            var item = _db.WishlistItems
                .FirstOrDefault(w => w.UserId == userId && w.ProductId == productId);

            if (item == null)
                return Result<int>.NotFound("wishlist item not found.");

            _db.WishlistItems.Remove(item);
            _db.SaveChanges();

            return Result<int>.Ok(item.Id);
        }

        public Result<Paged<WishlistItemResponse>> GetWishlist(int userId, PagedRequest req)
        {
            var query = _db.WishlistItems.Where(w => w.UserId == userId);

            var totalCount = query.Count();

            var items = query
                .OrderByDescending(w => w.Id)
                .Skip((req.Page - 1) * req.Take).Take(req.Take)
                .ProjectTo<WishlistItemResponse>(_mapper.ConfigurationProvider)
                .ToList();

            return Result<Paged<WishlistItemResponse>>.Ok(
                new Paged<WishlistItemResponse>(items, totalCount, req.Page, req.Take));
        }
    }
}
