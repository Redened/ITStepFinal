using ALTA.Common.DTOs.Requests;
using ALTA.Common.DTOs.Responses;
using ALTA.Common.Results;
using ALTA.DTOs.Requests;
using ALTA.DTOs.Responses;
using ALTA.Enums;
using ALTA.Services.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ALTA.Controllers
{
    [Route("api/admin"), ApiController, Authorize(Roles = "Admin,Manager")]
    [ProducesErrorResponseType(typeof(Result<int>))]
    public class AdminController : ControllerBase
    {
        private readonly IAdminServices _admin;

        public AdminController(IAdminServices admin) => _admin = admin;

        // ─── Analytics ───────────────────────────────────────────────────────────

        [HttpGet("dashboard")]
        [ProducesResponseType<Result<DashboardResponse>>(200)]
        public IActionResult GetDashboard()
        {
            var result = _admin.GetDashboard();
            return StatusCode(result.Status, result);
        }

        // ─── Products ────────────────────────────────────────────────────────────

        [HttpPost("products")]
        [ProducesResponseType<Result<int>>(201)]
        public IActionResult CreateProduct([FromBody] CreateProductRequest req)
        {
            var result = _admin.CreateProduct(req);
            return StatusCode(result.Status, result);
        }

        [HttpPut("products/{productId}")]
        [ProducesResponseType<Result<int>>(200)]
        public IActionResult UpdateProduct(int productId, [FromBody] UpdateProductRequest req)
        {
            var result = _admin.UpdateProduct(productId, req);
            return StatusCode(result.Status, result);
        }

        [HttpDelete("products/{productId}")]
        [ProducesResponseType<Result<int>>(200)]
        public IActionResult DeleteProduct(int productId)
        {
            var result = _admin.DeleteProduct(productId);
            return StatusCode(result.Status, result);
        }

        // ─── Categories ──────────────────────────────────────────────────────────

        [HttpPost("categories")]
        [ProducesResponseType<Result<int>>(201)]
        public IActionResult CreateCategory([FromBody] CreateCategoryRequest req)
        {
            var result = _admin.CreateCategory(req);
            return StatusCode(result.Status, result);
        }

        [HttpPut("categories/{categoryId}")]
        [ProducesResponseType<Result<int>>(200)]
        public IActionResult UpdateCategory(int categoryId, [FromBody] UpdateCategoryRequest req)
        {
            var result = _admin.UpdateCategory(categoryId, req);
            return StatusCode(result.Status, result);
        }

        [HttpDelete("categories/{categoryId}")]
        [ProducesResponseType<Result<int>>(200)]
        public IActionResult DeleteCategory(int categoryId)
        {
            var result = _admin.DeleteCategory(categoryId);
            return StatusCode(result.Status, result);
        }

        // ─── Orders ──────────────────────────────────────────────────────────────

        [HttpGet("orders")]
        [ProducesResponseType<Result<Paged<OrderResponse>>>(200)]
        public IActionResult GetAllOrders([FromQuery] OrderStatus? status, [FromQuery] PagedRequest req)
        {
            var result = _admin.GetAllOrders(status, req);
            return StatusCode(result.Status, result);
        }

        [HttpPut("orders/{orderId}/status")]
        [ProducesResponseType<Result<int>>(200)]
        public IActionResult UpdateOrderStatus(int orderId, [FromQuery] OrderStatus status)
        {
            var result = _admin.UpdateOrderStatus(orderId, status);
            return StatusCode(result.Status, result);
        }

        // ─── Users ───────────────────────────────────────────────────────────────

        [HttpGet("users")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType<Result<Paged<UserResponse>>>(200)]
        public IActionResult GetAllUsers([FromQuery] PagedRequest req)
        {
            var result = _admin.GetAllUsers(req);
            return StatusCode(result.Status, result);
        }

        [HttpPut("users/{userId}/role")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType<Result<int>>(200)]
        public IActionResult UpdateUserRole(int userId, [FromQuery] UserRoles role)
        {
            var result = _admin.UpdateUserRole(userId, role);
            return StatusCode(result.Status, result);
        }
    }
}
