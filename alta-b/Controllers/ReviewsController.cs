using ALTA.Common.DTOs.Requests;
using ALTA.Common.DTOs.Responses;
using ALTA.Common.Results;
using ALTA.DTOs.Requests;
using ALTA.DTOs.Responses;
using ALTA.Services.Reviews;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ALTA.Controllers
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
