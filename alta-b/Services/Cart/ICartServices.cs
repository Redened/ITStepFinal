using ALTA.Common.DTOs.Requests;
using ALTA.Common.DTOs.Responses;
using ALTA.Common.Results;
using ALTA.DTOs.Requests;
using ALTA.DTOs.Responses;

namespace ALTA.Services.Cart
{
    public interface ICartServices
    {
        Result<int> AddToCart(int userId, AddToCartDto req);
        Result<int> EditCart(int userId, EditCartDto req);
        Result<int> DeleteCartItem(int id, int userId);
        Result<Paged<CartItemResponse>> GetCart(int userId, PagedRequest req);
    }
}
