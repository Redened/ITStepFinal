using ALTA.Common.DTOs.Requests;
using ALTA.Common.DTOs.Responses;
using ALTA.Common.Results;
using ALTA.DTOs.Requests;
using ALTA.DTOs.Responses;
using ALTA.Enums;
using ALTA.Models;

namespace ALTA.Services.Orders
{
    public interface IOrderServices
    {
        Result<int> Checkout(int userId, CheckoutRequest req);
        Result<int> ConfirmOrder(int userId, int orderId);
        Result<int> CancelOrder(int userId, int orderId);
        Result<Paged<OrderResponse>> GetOrderHistory(int userId, OrderStatus? status, PagedRequest req);
    }
}
