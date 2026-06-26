using VAPE.Common.DTOs.Requests;
using VAPE.Common.DTOs.Responses;
using VAPE.Common.Results;
using VAPE.DTOs.Requests;
using VAPE.DTOs.Responses;

namespace VAPE.Services.Wishlist
{
    public interface IWishlistServices
    {
        Result<int> AddToWishlist(int userId, AddWishlistRequest req);
        Result<int> RemoveFromWishlist(int userId, int productId);
        Result<Paged<WishlistItemResponse>> GetWishlist(int userId, PagedRequest req);
    }
}
