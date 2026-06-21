using ALTA.Common.DTOs.Requests;
using ALTA.Common.DTOs.Responses;
using ALTA.Common.Results;
using ALTA.DTOs.Requests;
using ALTA.DTOs.Responses;
using ALTA.Enums;

namespace ALTA.Services.Admin
{
    public interface IAdminServices
    {
        // Products
        Result<int> CreateProduct(CreateProductRequest req);
        Result<int> UpdateProduct(int productId, UpdateProductRequest req);
        Result<int> DeleteProduct(int productId);

        // Categories
        Result<int> CreateCategory(CreateCategoryRequest req);
        Result<int> UpdateCategory(int categoryId, UpdateCategoryRequest req);
        Result<int> DeleteCategory(int categoryId);

        // Orders
        Result<Paged<OrderResponse>> GetAllOrders(OrderStatus? status, PagedRequest req);
        Result<int> UpdateOrderStatus(int orderId, OrderStatus status);

        // Users
        Result<Paged<UserResponse>> GetAllUsers(PagedRequest req);
        Result<int> UpdateUserRole(int userId, UserRoles role);

        // Analytics
        Result<DashboardResponse> GetDashboard();
    }
}
