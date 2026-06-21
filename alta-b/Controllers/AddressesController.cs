using ALTA.Common.Results;
using ALTA.DTOs.Requests;
using ALTA.DTOs.Responses;
using ALTA.Services.Addresses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ALTA.Controllers
{
    [Route("api/addresses"), ApiController, Authorize]
    [ProducesErrorResponseType(typeof(Result<int>))]
    public class AddressesController : ControllerBase
    {
        private readonly IAddressServices _addresses;

        public AddressesController(IAddressServices addresses) => _addresses = addresses;

        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        [ProducesResponseType<Result<List<AddressResponse>>>(200)]
        public IActionResult Get()
        {
            var result = _addresses.GetAddresses(GetUserId());
            return StatusCode(result.Status, result);
        }

        [HttpPost]
        public IActionResult Create(CreateAddressRequest req)
        {
            var result = _addresses.CreateAddress(GetUserId(), req);
            return StatusCode(result.Status, result);
        }

        [HttpPut("{addressId}")]
        public IActionResult Update(int addressId, UpdateAddressRequest req)
        {
            var result = _addresses.UpdateAddress(GetUserId(), addressId, req);
            return StatusCode(result.Status, result);
        }

        [HttpDelete("{addressId}")]
        public IActionResult Delete(int addressId)
        {
            var result = _addresses.DeleteAddress(GetUserId(), addressId);
            return StatusCode(result.Status, result);
        }
    }
}
