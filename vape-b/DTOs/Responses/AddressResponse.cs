namespace VAPE.DTOs.Responses
{
    public class AddressResponse
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string FullName { get; set; }
        public string Line { get; set; }
        public string City { get; set; }
        public string? PostalCode { get; set; }
        public bool IsDefault { get; set; }
    }
}
