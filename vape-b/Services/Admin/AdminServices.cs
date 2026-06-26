using VAPE.Common.DTOs.Requests;
using VAPE.Common.DTOs.Responses;
using VAPE.Common.Results;
using VAPE.Common.Validation;
using VAPE.Data;
using VAPE.DTOs.Requests;
using VAPE.DTOs.Responses;
using VAPE.Enums;
using VAPE.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using FluentValidation;

namespace VAPE.Services.Admin
{
    public class AdminServices : IAdminServices
    {
        private readonly DataContext _db;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateProductRequest> _createProductValidator;
        private readonly IValidator<UpdateProductRequest> _updateProductValidator;
        private readonly IValidator<CreateCategoryRequest> _createCategoryValidator;
        private readonly IValidator<UpdateCategoryRequest> _updateCategoryValidator;

        public AdminServices(
            DataContext db,
            IMapper mapper,
            IValidator<CreateProductRequest> createProductValidator,
            IValidator<UpdateProductRequest> updateProductValidator,
            IValidator<CreateCategoryRequest> createCategoryValidator,
            IValidator<UpdateCategoryRequest> updateCategoryValidator)
        {
            _db = db;
            _mapper = mapper;
            _createProductValidator = createProductValidator;
            _updateProductValidator = updateProductValidator;
            _createCategoryValidator = createCategoryValidator;
            _updateCategoryValidator = updateCategoryValidator;
        }

        // ─── Products ────────────────────────────────────────────────────────────

        public Result<int> CreateProduct(CreateProductRequest req)
        {
            var errors = _createProductValidator.GetErrors(req);

            if (errors != null)
                return Result<int>.ValidationError(errors);

            if (!_db.Categories.Any(c => c.Id == req.CategoryId))
                return Result<int>.NotFound("Category not found.");

            var product = new Product
            {
                Title = req.Title,
                Description = req.Description,
                Stock = req.Stock,
                Price = req.Price,
                Image = req.Image,
                Gallery = req.Gallery,
                CategoryId = req.CategoryId,
                Status = req.Status,
                Discount = req.Discount,
            };

            _db.Products.Add(product);
            _db.SaveChanges();

            return Result<int>.Success(201, product.Id);
        }

        public Result<int> UpdateProduct(int productId, UpdateProductRequest req)
        {
            var errors = _updateProductValidator.GetErrors(req);

            if (errors != null)
                return Result<int>.ValidationError(errors);

            var product = _db.Products.Find(productId);

            if (product == null)
                return Result<int>.NotFound("Product not found.");

            if (req.CategoryId.HasValue && !_db.Categories.Any(c => c.Id == req.CategoryId))
                return Result<int>.NotFound("Category not found.");

            if (req.Title != null) product.Title = req.Title;
            if (req.Description != null) product.Description = req.Description;
            if (req.Stock.HasValue) product.Stock = req.Stock.Value;
            if (req.Price.HasValue) product.Price = req.Price.Value;
            if (req.Image != null) product.Image = req.Image;
            if (req.Gallery != null) product.Gallery = req.Gallery;
            if (req.CategoryId.HasValue) product.CategoryId = req.CategoryId.Value;
            if (req.Status.HasValue) product.Status = req.Status.Value;
            if (req.Discount.HasValue) product.Discount = req.Discount.Value < 0 ? null : req.Discount.Value;

            _db.SaveChanges();

            return Result<int>.Ok(product.Id);
        }

        public Result<int> DeleteProduct(int productId)
        {
            var product = _db.Products.Find(productId);

            if (product == null)
                return Result<int>.NotFound("Product not found.");

            _db.Products.Remove(product);
            _db.SaveChanges();

            return Result<int>.Ok(productId);
        }

        // ─── Categories ──────────────────────────────────────────────────────────

        public Result<int> CreateCategory(CreateCategoryRequest req)
        {
            var errors = _createCategoryValidator.GetErrors(req);

            if (errors != null)
                return Result<int>.ValidationError(errors);

            if (req.ParentId.HasValue && !_db.Categories.Any(c => c.Id == req.ParentId))
                return Result<int>.NotFound("Parent category not found.");

            var category = new Category
            {
                Name = req.Name,
                ImageUrl = req.ImageUrl,
                Description = req.Description,
                ParentId = req.ParentId,
            };

            _db.Categories.Add(category);
            _db.SaveChanges();

            return Result<int>.Success(201, category.Id);
        }

        public Result<int> UpdateCategory(int categoryId, UpdateCategoryRequest req)
        {
            var errors = _updateCategoryValidator.GetErrors(req);

            if (errors != null)
                return Result<int>.ValidationError(errors);

            var category = _db.Categories.Find(categoryId);

            if (category == null)
                return Result<int>.NotFound("Category not found.");

            if (req.ParentId.HasValue)
            {
                if (req.ParentId == categoryId)
                    return Result<int>.BadRequest("A category cannot be its own parent.");

                if (!_db.Categories.Any(c => c.Id == req.ParentId))
                    return Result<int>.NotFound("Parent category not found.");
            }

            if (req.Name != null) category.Name = req.Name;
            if (req.ImageUrl != null) category.ImageUrl = req.ImageUrl;
            if (req.Description != null) category.Description = req.Description;
            if (req.ParentId.HasValue) category.ParentId = req.ParentId;

            _db.SaveChanges();

            return Result<int>.Ok(category.Id);
        }

        public Result<int> DeleteCategory(int categoryId)
        {
            var category = _db.Categories.Find(categoryId);

            if (category == null)
                return Result<int>.NotFound("Category not found.");

            _db.Categories.Remove(category);
            _db.SaveChanges();

            return Result<int>.Ok(categoryId);
        }

        // ─── Orders ──────────────────────────────────────────────────────────────

        public Result<Paged<OrderResponse>> GetAllOrders(OrderStatus? status, PagedRequest req)
        {
            var query = _db.Orders
                .Where(o => o.Status != OrderStatus.Deleted)
                .AsQueryable();

            if (status.HasValue)
                query = query.Where(o => o.Status == status);

            var totalCount = query.Count();

            var orders = query
                .Skip((req.Page - 1) * req.Take).Take(req.Take)
                .ProjectTo<OrderResponse>(_mapper.ConfigurationProvider)
                .ToList();

            return Result<Paged<OrderResponse>>.Ok(
                new Paged<OrderResponse>(orders, totalCount, req.Page, req.Take));
        }

        public Result<int> UpdateOrderStatus(int orderId, OrderStatus status)
        {
            var order = _db.Orders.Find(orderId);

            if (order == null)
                return Result<int>.NotFound("Order not found.");

            order.Status = status;
            _db.SaveChanges();

            return Result<int>.Ok(order.Id);
        }

        // ─── Users ───────────────────────────────────────────────────────────────

        public Result<Paged<UserResponse>> GetAllUsers(PagedRequest req)
        {
            var totalCount = _db.Users.Count();

            var users = _db.Users
                .Skip((req.Page - 1) * req.Take).Take(req.Take)
                .ProjectTo<UserResponse>(_mapper.ConfigurationProvider)
                .ToList();

            return Result<Paged<UserResponse>>.Ok(
                new Paged<UserResponse>(users, totalCount, req.Page, req.Take));
        }

        public Result<int> UpdateUserRole(int userId, UserRoles role)
        {
            var user = _db.Users.Find(userId);

            if (user == null)
                return Result<int>.NotFound("User not found.");

            user.Role = role;
            _db.SaveChanges();

            return Result<int>.Ok(user.Id);
        }

        // ─── Analytics ───────────────────────────────────────────────────────────

        private const int LowStockThreshold = 5;

        public Result<DashboardResponse> GetDashboard()
        {
            var lowStock = _db.Products
                .Where(p => p.Stock < LowStockThreshold)
                .OrderBy(p => p.Stock)
                .Take(10)
                .ProjectTo<ProductResponse>(_mapper.ConfigurationProvider)
                .ToList();

            var topProducts = _db.OrderItems
                .GroupBy(oi => new { oi.ProductId, oi.Product.Title })
                .Select(g => new TopProductResponse
                {
                    ProductId = g.Key.ProductId,
                    Title = g.Key.Title,
                    UnitsSold = g.Sum(x => x.Quantity)
                })
                .OrderByDescending(t => t.UnitsSold)
                .Take(5)
                .ToList();

            var dashboard = new DashboardResponse
            {
                TotalProducts = _db.Products.Count(),
                TotalUsers = _db.Users.Count(),
                TotalOrders = _db.Orders.Count(o => o.Status != OrderStatus.Deleted),
                PendingOrders = _db.Orders.Count(o => o.Status == OrderStatus.Pending),
                TotalSales = _db.Orders
                    .Where(o => o.Status == OrderStatus.Confirmed)
                    .Sum(o => (double?)o.TotalAmount) ?? 0,
                LowStockCount = _db.Products.Count(p => p.Stock < LowStockThreshold),
                LowStockProducts = lowStock,
                TopProducts = topProducts,
            };

            return Result<DashboardResponse>.Ok(dashboard);
        }
    }
}
