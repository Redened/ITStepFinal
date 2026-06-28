using VAPE.Common.DTOs.Requests;
using VAPE.Common.DTOs.Responses;
using VAPE.Common.Results;
using VAPE.Data;
using VAPE.DTOs.Requests;
using VAPE.DTOs.Responses;
using VAPE.Enums;
using VAPE.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace VAPE.Services.Orders
{
    public class OrderServices : IOrderServices
    {
        private readonly DataContext _db;
        private readonly IMapper _mapper;


        public OrderServices(DataContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        public Result<int> Checkout(int userId, CheckoutRequest req)
        {
            var items = _db.CartItems
                .Include(c => c.Product)
                .Where(c => c.UserId == userId).ToList();

            if (!items.Any())
                return Result<int>.BadRequest("you cart is empty.");

            foreach (var item in items)
            {
                if (item.Product.Stock < item.Quantity)
                    return Result<int>.BadRequest($"'{item.Product.Title}' only has {item.Product.Stock} units in stock.");
            }

            foreach (var item in items)
                item.Product.Stock -= item.Quantity;

            // Snapshot the unit price at purchase time so order history stays
            // correct even if the product's price later changes.
            var orderItems = items
                .Select(e => new OrderItem
                {
                    Quantity = e.Quantity,
                    ProductId = e.ProductId,
                    Price = e.Product.Price
                })
                .ToList();

            var totalAmount = orderItems.Sum(i => i.Price * i.Quantity);

            Order order = new Order()
            {
                UserId = userId,
                OrderItems = orderItems,
                TotalAmount = totalAmount,
                ShippingAddress = req.ShippingAddress,

            };

            _db.Orders.Add(order);
            _db.CartItems.RemoveRange(items);

            _db.SaveChanges();

            return Result<int>.Ok(order.Id);
        }

        public Result<int> CancelOrder(int userId, int orderId)
        {
            var order = _db.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .FirstOrDefault(o => o.UserId == userId && o.Id == orderId);

            if (order == null)
                return Result<int>.NotFound("order not found.");

            if (order.Status != OrderStatus.Pending)
                return Result<int>.BadRequest("you can only cancel pending orders");

            foreach (var item in order.OrderItems)
                item.Product.Stock += item.Quantity;

            order.Status = OrderStatus.Cancelled;

            _db.SaveChanges();

            return Result<int>.Ok(order.Id);
        }

        public Result<int> ConfirmOrder(int userId, int orderId)
        {
            var order = _db.Orders
                .FirstOrDefault(o => o.UserId == userId && o.Id == orderId);

            if (order == null)
                return Result<int>.NotFound("order not found.");

            if (order.Status != OrderStatus.Pending)
                return Result<int>.BadRequest("you can only confirm pending orders");

            order.Status = OrderStatus.Confirmed;

            _db.SaveChanges();

            return Result<int>.Ok(order.Id);
        }


        public Result<Paged<OrderResponse>> GetOrderHistory(int userId, OrderStatus? status, PagedRequest req)
        {
            var query = _db.Orders
                .Where(o => o.UserId == userId && o.Status != OrderStatus.Deleted).AsQueryable();

            if (status.HasValue)
                query = query.Where(p => p.Status == status);

            var orders = query
                .OrderByDescending(o => o.CreatedAt)
                .Skip((req.Page - 1) * req.Take).Take(req.Take)
                .ProjectTo<OrderResponse>(_mapper.ConfigurationProvider)
                .ToList();

            var totalCount = query.Count();

            var result = new Paged<OrderResponse>(
                orders, totalCount, req.Page, req.Take);

            return Result<Paged<OrderResponse>>.Ok(result);
        }
    }
}