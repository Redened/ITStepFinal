using ALTA.Common.DTOs.Requests;
using ALTA.Common.DTOs.Responses;
using ALTA.Common.Results;
using ALTA.DTOs.Requests;
using ALTA.DTOs.Responses;

namespace ALTA.Services.Wishlist
{
    public interface IWishlistServices
    {
        Result<int> AddToWishlist(int userId, AddWishlistRequest req);
        Result<int> RemoveFromWishlist(int userId, int productId);
        Result<Paged<WishlistItemResponse>> GetWishlist(int userId, PagedRequest req);
    }
}
