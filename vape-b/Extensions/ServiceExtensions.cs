using VAPE.Common.Services;
using VAPE.Data;
using VAPE.Services.Admin;
using VAPE.Services.Auth;
using VAPE.Services.Cart;
using VAPE.Services.Categories;
using VAPE.Services.Addresses;
using VAPE.Services.Orders;
using VAPE.Services.Products;
using VAPE.Services.Reviews;
using VAPE.Services.Users;
using VAPE.Services.Wishlist;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace VAPE.Extensions
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddEndpointsApiExplorer();
            services.AddControllers();
            services.AddSwaggerGen();
            services.AddJwt(config);

            services.AddAutoMapper(typeof(Program).Assembly);

            services.AddValidatorsFromAssemblyContaining<Program>();

            services.AddDbContext<DataContext>(o
                => o.UseNpgsql(config.GetConnectionString("Default")));

            services.AddScoped<IAdminServices, AdminServices>();
            services.AddScoped<ICategoryServices, CategoryServices>();
            services.AddScoped<IProductServices, ProductServices>();
            services.AddScoped<IOrderServices, OrderServices>();
            services.AddScoped<ICartServices, CartServices>();
            services.AddScoped<IAuthServices, AuthServices>();
            services.AddScoped<IUserServices, UserServices>();
            services.AddScoped<IWishlistServices, WishlistServices>();
            services.AddScoped<IReviewServices, ReviewServices>();
            services.AddScoped<IAddressServices, AddressServices>();

            // Common
            services.AddScoped<SmtpServices>();
            services.AddScoped<JwtService>();

            var allowedOrigins = config.GetSection("Cors:AllowedOrigins").Get<string[]>()
                ?? new[] { "http://localhost:4200" };

            services.AddCors(s => s.AddDefaultPolicy(p
                => p.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod()));

            return services;
        }
    }
}