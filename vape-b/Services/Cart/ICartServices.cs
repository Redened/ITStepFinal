using VAPE.Common.DTOs.Requests;
using VAPE.Common.DTOs.Responses;
using VAPE.Common.Results;
using VAPE.DTOs.Requests;
using VAPE.DTOs.Responses;

namespace VAPE.Services.Cart
{
    public interface ICartServices
    {
        Result<int> AddToCart(int userId, AddToCartDto req);
        Result<int> EditCart(int userId, EditCartDto req);
        Result<int> DeleteCartItem(int id, int userId);
        Result<Paged<CartItemResponse>> GetCart(int userId, PagedRequest req);
    }
}
