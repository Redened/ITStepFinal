using ALTA.Common.DTOs.Requests;
using ALTA.Common.DTOs.Responses;
using ALTA.Common.Results;
using ALTA.Common.Validation;
using ALTA.Data;
using ALTA.DTOs.Requests;
using ALTA.DTOs.Responses;
using ALTA.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using FluentValidation;

namespace ALTA.Services.Cart
{
    public class CartServices : ICartServices
    {
        private readonly DataContext _db;
        private readonly IMapper _mapper;
        private readonly IValidator<AddToCartDto> _addToCartValidator;
        private readonly IValidator<EditCartDto> _editCartValidator;

        public CartServices(
            DataContext db,
            IMapper mapper,
            IValidator<AddToCartDto> addToCartValidator,
            IValidator<EditCartDto> editCartValidator)
        {
            _db = db;
            _mapper = mapper;
            _addToCartValidator = addToCartValidator;
            _editCartValidator = editCartValidator;
        }

        public Result<int> AddToCart(int userId, AddToCartDto req)
        {
            var errors = _addToCartValidator.GetErrors(req);

            if (errors != null)
                return Result<int>.ValidationError(errors);

            var product = _db.Products.Find(req.ProductId);

            if (product == null)
                return Result<int>.NotFound("product not found.");

            var alreadyInCart = _db.CartItems
                .FirstOrDefault(c => c.UserId == userId && c.ProductId == req.ProductId);


            if (alreadyInCart == null)
            {
                CartItem item = new CartItem()
                {
                    ProductId = req.ProductId,
                    Quantity = req.Quantity,
                    UserId = userId,
                };

                _db.CartItems.Add(item);
            }
            else
            {
                alreadyInCart.Quantity += req.Quantity;
            }

            _db.SaveChanges();


            return Result<int>.Ok(userId);
        }

        public Result<int> DeleteCartItem(int id, int userId)
        {
            var cartItem = _db.CartItems
                .FirstOrDefault(c => c.Id == id && c.UserId == userId);

            if (cartItem == null)
                return Result<int>.NotFound("cart item not found.");

            _db.CartItems.Remove(cartItem);
            _db.SaveChanges();

            return Result<int>.Ok(cartItem.Id);
        }

        public Result<int> EditCart(int userId, EditCartDto req)
        {
            var errors = _editCartValidator.GetErrors(req);

            if (errors != null)
                return Result<int>.ValidationError(errors);

            var cartItem = _db.CartItems
               .FirstOrDefault(c => c.Id == req.ItemId && c.UserId == userId);

            if (cartItem == null)
                return Result<int>.NotFound("cart item not found.");

            cartItem.Quantity = req.Quantity;

            _db.SaveChanges();

            return Result<int>.Ok(cartItem.Id);
        }

        public Result<Paged<CartItemResponse>> GetCart(int userId, PagedRequest req)
        {
            var items = _db.CartItems
                .Where(c => c.UserId == userId)
                .Skip((req.Page - 1) * req.Take).Take(req.Take)
                .ProjectTo<CartItemResponse>(_mapper.ConfigurationProvider)
                .ToList();

            var totalCount = _db.CartItems.Count();

            var result = new Paged<CartItemResponse>(
                items, totalCount, req.Page, req.Take);

            return Result<Paged<CartItemResponse>>.Ok(result);
        }
    }
}
