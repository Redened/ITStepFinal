using ALTA.Common.DTOs.Requests;
using ALTA.Common.DTOs.Responses;
using ALTA.Common.Results;
using ALTA.DTOs.Requests;
using ALTA.DTOs.Responses;
using ALTA.Services.Wishlist;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ALTA.Controllers
{
    [Route("api/wishlist"), ApiController, Authorize]
    [ProducesErrorResponseType(typeof(Result<int>))]
    public class WishlistController : ControllerBase
    {
        private readonly IWishlistServices _wishlist;

        public WishlistController(IWishlistServices wishlist) => _wishlist = wishlist;

        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        [ProducesResponseType<Result<Paged<WishlistItemResponse>>>(200)]
        public IActionResult Get([FromQuery] PagedRequest req)
        {
            var result = _wishlist.GetWishlist(GetUserId(), req);
            return StatusCode(result.Status, result);
        }

        [HttpPost]
        public IActionResult Add(AddWishlistRequest req)
        {
            var result = _wishlist.AddToWishlist(GetUserId(), req);
            return StatusCode(result.Status, result);
        }

        [HttpDelete("{productId}")]
        public IActionResult Remove(int productId)
        {
            var result = _wishlist.RemoveFromWishlist(GetUserId(), productId);
            return StatusCode(result.Status, result);
        }
    }
}
