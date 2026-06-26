using VAPE.Common.DTOs.Requests;
using VAPE.Common.DTOs.Responses;
using VAPE.Common.Results;
using VAPE.DTOs.Requests;
using VAPE.DTOs.Responses;

namespace VAPE.Services.Reviews
{
    public interface IReviewServices
    {
        Result<int> CreateReview(int userId, CreateReviewRequest req);
        Result<Paged<ReviewResponse>> GetProductReviews(int productId, PagedRequest req);
    }
}
