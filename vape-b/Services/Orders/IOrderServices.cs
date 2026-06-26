using VAPE.Common.DTOs.Requests;
using VAPE.Common.DTOs.Responses;
using VAPE.Common.Results;
using VAPE.DTOs.Requests;
using VAPE.DTOs.Responses;
using VAPE.Enums;
using VAPE.Models;

namespace VAPE.Services.Orders
{
    public interface IOrderServices
    {
        Result<int> Checkout(int userId, CheckoutRequest req);
        Result<int> ConfirmOrder(int userId, int orderId);
        Result<int> CancelOrder(int userId, int orderId);
        Result<Paged<OrderResponse>> GetOrderHistory(int userId, OrderStatus? status, PagedRequest req);
    }
}
