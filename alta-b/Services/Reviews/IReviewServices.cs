using ALTA.Common.DTOs.Requests;
using ALTA.Common.DTOs.Responses;
using ALTA.Common.Results;
using ALTA.DTOs.Requests;
using ALTA.DTOs.Responses;

namespace ALTA.Services.Reviews
{
    public interface IReviewServices
    {
        Result<int> CreateReview(int userId, CreateReviewRequest req);
        Result<Paged<ReviewResponse>> GetProductReviews(int productId, PagedRequest req);
    }
}
