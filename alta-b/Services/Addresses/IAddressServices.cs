using ALTA.Common.Results;
using ALTA.DTOs.Requests;
using ALTA.DTOs.Responses;

namespace ALTA.Services.Addresses
{
    public interface IAddressServices
    {
        Result<List<AddressResponse>> GetAddresses(int userId);
        Result<int> CreateAddress(int userId, CreateAddressRequest req);
        Result<int> UpdateAddress(int userId, int addressId, UpdateAddressRequest req);
        Result<int> DeleteAddress(int userId, int addressId);
    }
}
