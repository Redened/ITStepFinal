using VAPE.Common.DTOs.Requests;
using VAPE.Common.DTOs.Responses;
using VAPE.Common.Results;
using VAPE.DTOs.Requests;
using VAPE.DTOs.Responses;
using VAPE.Services.Reviews;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace VAPE.Controllers
{
    [Route("api/reviews"), ApiController]
    [ProducesErrorResponseType(typeof(Result<int>))]
    public class ReviewsController : ControllerBase
    {
        private readonly IReviewServices _reviews;

        public ReviewsController(IReviewServices reviews) => _reviews = reviews;

        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet("product/{productId}")]
        [ProducesResponseType<Result<Paged<ReviewResponse>>>(200)]
        public IActionResult GetForProduct(int productId, [FromQuery] PagedRequest req)
        {
            var result = _reviews.GetProductReviews(productId, req);
            return StatusCode(result.Status, result);
        }

        [HttpPost, Authorize]
        public IActionResult Create(CreateReviewRequest req)
        {
            var result = _reviews.CreateReview(GetUserId(), req);
            return StatusCode(result.Status, result);
        }
    }
}
