using ALTA.Common.DTOs.Requests;
using ALTA.Common.DTOs.Responses;
using ALTA.Common.Results;
using ALTA.Data;
using ALTA.DTOs.Requests;
using ALTA.DTOs.Responses;
using ALTA.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace ALTA.Services.Reviews
{
    public class ReviewServices : IReviewServices
    {
        private readonly DataContext _db;
        private readonly IMapper _mapper;

        public ReviewServices(DataContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        public Result<int> CreateReview(int userId, CreateReviewRequest req)
        {
            if (req.Rating < 1 || req.Rating > 5)
                return Result<int>.BadRequest("rating must be between 1 and 5.");

            if (!_db.Products.Any(p => p.Id == req.ProductId))
                return Result<int>.NotFound("product not found.");

            // One review per user per product: update if it already exists.
            var existing = _db.Reviews
                .FirstOrDefault(r => r.UserId == userId && r.ProductId == req.ProductId);

            if (existing != null)
            {
                existing.Rating = req.Rating;
                existing.Comment = req.Comment;
                _db.SaveChanges();
                return Result<int>.Ok(existing.Id);
            }

            var review = new Review
            {
                UserId = userId,
                ProductId = req.ProductId,
                Rating = req.Rating,
                Comment = req.Comment,
            };

            _db.Reviews.Add(review);
            _db.SaveChanges();

            return Result<int>.Success(201, review.Id);
        }

        public Result<Paged<ReviewResponse>> GetProductReviews(int productId, PagedRequest req)
        {
            var query = _db.Reviews.Where(r => r.ProductId == productId);

            var totalCount = query.Count();

            var reviews = query
                .OrderByDescending(r => r.Id)
                .Skip((req.Page - 1) * req.Take).Take(req.Take)
                .ProjectTo<ReviewResponse>(_mapper.ConfigurationProvider)
                .ToList();

            return Result<Paged<ReviewResponse>>.Ok(
                new Paged<ReviewResponse>(reviews, totalCount, req.Page, req.Take));
        }
    }
}
