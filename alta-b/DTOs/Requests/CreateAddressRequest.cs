namespace ALTA.DTOs.Requests
{
    public class CreateAddressRequest
    {
        public string Title { get; set; }
        public string FullName { get; set; }
        public string Line { get; set; }
        public string City { get; set; }
        public string? PostalCode { get; set; }
        public bool IsDefault { get; set; }
    }
}
