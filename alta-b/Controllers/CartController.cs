using ALTA.Common.DTOs.Requests;
using ALTA.Common.DTOs.Responses;
using ALTA.Common.Results;
using ALTA.DTOs.Requests;
using ALTA.DTOs.Responses;
using ALTA.Services.Cart;
using Azure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ALTA.Controllers
{
    [Route("api/cart"), ApiController, Authorize]
    [ProducesErrorResponseType(typeof(Result<int>))]
    public class CartController : ControllerBase
    {
        private readonly ICartServices _cart;

        public CartController(ICartServices cart) => _cart = cart;

        private int GetUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }

        [HttpPost]
        public IActionResult AddToCart(AddToCartDto req)
        {
            var result = _cart.AddToCart(GetUserId(), req);

            return StatusCode(result.Status, result);
        }

        [HttpPut]
        public IActionResult EditCart(EditCartDto req)
        {
            var result = _cart.EditCart(GetUserId(), req);

            return StatusCode(result.Status, result);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _cart.DeleteCartItem(id, GetUserId());

            return StatusCode(result.Status, result);
        }

        [HttpGet]
        [ProducesResponseType<Result<Paged<CartItemResponse>>>(200)]
        public IActionResult GetCart([FromQuery] PagedRequest req)
        {
            var result = _cart.GetCart(GetUserId(), req);

            return StatusCode(result.Status, result);
        }
    }
}