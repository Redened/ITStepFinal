using ALTA.Common.DTOs.Requests;
using ALTA.Common.DTOs.Responses;
using ALTA.Common.Results;
using ALTA.DTOs.Requests;
using ALTA.DTOs.Responses;
using ALTA.Enums;
using ALTA.Services.Orders;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ALTA.Controllers
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