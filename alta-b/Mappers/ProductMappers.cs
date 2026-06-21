using ALTA.DTOs.Responses;
using ALTA.Models;
using AutoMapper;

namespace ALTA.Mappers
{
    public class ProductMappers : Profile
    {
        public ProductMappers()
        {
            CreateMap<Product, ProductResponse>()
                .ForMember(d => d.AverageRating,
                    o => o.MapFrom(s => s.Reviews.Any() ? s.Reviews.Average(r => r.Rating) : 0.0))
                .ForMember(d => d.ReviewCount, o => o.MapFrom(s => s.Reviews.Count));

            CreateMap<Product, ProductDetailsResponse>()
                .ForMember(d => d.AverageRating,
                    o => o.MapFrom(s => s.Reviews.Any() ? s.Reviews.Average(r => r.Rating) : 0.0))
                .ForMember(d => d.ReviewCount, o => o.MapFrom(s => s.Reviews.Count));

            CreateMap<Category, CategoryResponse>();
            CreateMap<CartItem, CartItemResponse>();
            CreateMap<Order, OrderResponse>();
            CreateMap<OrderItem, OrderItemResponse>();
            CreateMap<User, UserResponse>();

            CreateMap<WishlistItem, WishlistItemResponse>();
            CreateMap<Review, ReviewResponse>()
                .ForMember(d => d.Username, o => o.MapFrom(s => s.User.Username));
            CreateMap<Address, AddressResponse>();
        }
    }
}
