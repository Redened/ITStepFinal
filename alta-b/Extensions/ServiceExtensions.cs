using ALTA.Common.Services;
using ALTA.Data;
using ALTA.Services.Admin;
using ALTA.Services.Auth;
using ALTA.Services.Cart;
using ALTA.Services.Categories;
using ALTA.Services.Addresses;
using ALTA.Services.Orders;
using ALTA.Services.Products;
using ALTA.Services.Reviews;
using ALTA.Services.Users;
using ALTA.Services.Wishlist;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace ALTA.Extensions
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
                => o.UseSqlServer(config.GetConnectionString("Default")));

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