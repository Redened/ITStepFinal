namespace ALTA.DTOs.Responses
{
    public class ProfileResponse
    {
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }
    }
}
