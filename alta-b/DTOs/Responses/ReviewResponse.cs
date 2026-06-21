namespace ALTA.DTOs.Responses
{
    public class ReviewResponse
    {
        public int Id { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public string Username { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
