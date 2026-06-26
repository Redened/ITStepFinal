using VAPE.Common.DTOs.Requests;
using VAPE.Common.DTOs.Responses;
using VAPE.Common.Results;
using VAPE.DTOs.Requests;
using VAPE.DTOs.Responses;
using VAPE.Enums;
using VAPE.Services.Orders;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace VAPE.Controllers
{
    [Route("api/orders"), ApiController, Authorize]
    [ProducesErrorResponseType(typeof(Result<int>))]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderServices _order;

        public OrdersController(IOrderServices order) => _order = order;

        private int GetUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }

        [HttpPost("checkout")]
        public IActionResult Checkout([FromBody] CheckoutRequest req)
        {
            var result = _order.Checkout(GetUserId(), req);

            return StatusCode(result.Status, result);
        }

        [HttpPost("{orderId}/confirm")]
        public IActionResult Confirm(int orderId)
        {
            var result = _order.ConfirmOrder(GetUserId(), orderId);

            return StatusCode(result.Status, result);
        }

        [HttpPost("{orderId}/cancel")]
        public IActionResult Cancel(int orderId)
        {
            var result = _order.CancelOrder(GetUserId(), orderId);

            return StatusCode(result.Status, result);
        }

        [HttpGet]
        [ProducesResponseType<Result<Paged<OrderResponse>>>(200)]
        public IActionResult GetHistory([FromQuery] OrderStatus? status, [FromQuery] PagedRequest req)
        {
            var result = _order.GetOrderHistory(GetUserId(), status, req);

            return StatusCode(result.Status, result);
        }
    }
}