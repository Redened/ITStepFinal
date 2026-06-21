using ALTA.Common.Results;
using ALTA.Data;
using ALTA.DTOs.Requests;
using ALTA.DTOs.Responses;
using ALTA.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace ALTA.Services.Addresses
{
    public class AddressServices : IAddressServices
    {
        private readonly DataContext _db;
        private readonly IMapper _mapper;

        public AddressServices(DataContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        public Result<List<AddressResponse>> GetAddresses(int userId)
        {
            var addresses = _db.Addresses
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.IsDefault).ThenBy(a => a.Id)
                .ProjectTo<AddressResponse>(_mapper.ConfigurationProvider)
                .ToList();

            return Result<List<AddressResponse>>.Ok(addresses);
        }

        public Result<int> CreateAddress(int userId, CreateAddressRequest req)
        {
            var address = new Address
            {
                UserId = userId,
                Title = req.Title,
                FullName = req.FullName,
                Line = req.Line,
                City = req.City,
                PostalCode = req.PostalCode,
                IsDefault = req.IsDefault,
            };

            // First address is the default; an explicit default clears the rest.
            if (!_db.Addresses.Any(a => a.UserId == userId))
                address.IsDefault = true;
            else if (req.IsDefault)
                ClearDefault(userId);

            _db.Addresses.Add(address);
            _db.SaveChanges();

            return Result<int>.Success(201, address.Id);
        }

        public Result<int> UpdateAddress(int userId, int addressId, UpdateAddressRequest req)
        {
            var address = _db.Addresses
                .FirstOrDefault(a => a.Id == addressId && a.UserId == userId);

            if (address == null)
                return Result<int>.NotFound("address not found.");

            if (req.Title != null) address.Title = req.Title;
            if (req.FullName != null) address.FullName = req.FullName;
            if (req.Line != null) address.Line = req.Line;
            if (req.City != null) address.City = req.City;
            if (req.PostalCode != null) address.PostalCode = req.PostalCode;

            if (req.IsDefault == true)
            {
                ClearDefault(userId);
                address.IsDefault = true;
            }

            _db.SaveChanges();

            return Result<int>.Ok(address.Id);
        }

        public Result<int> DeleteAddress(int userId, int addressId)
        {
            var address = _db.Addresses
                .FirstOrDefault(a => a.Id == addressId && a.UserId == userId);

            if (address == null)
                return Result<int>.NotFound("address not found.");

            _db.Addresses.Remove(address);
            _db.SaveChanges();

            return Result<int>.Ok(addressId);
        }

        private void ClearDefault(int userId)
        {
            foreach (var a in _db.Addresses.Where(a => a.UserId == userId && a.IsDefault))
                a.IsDefault = false;
        }
    }
}
