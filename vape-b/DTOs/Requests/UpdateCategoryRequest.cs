namespace VAPE.DTOs.Requests
{
    public class UpdateCategoryRequest
    {
        public string? Name { get; set; }
        public string? ImageUrl { get; set; }
        public string? Description { get; set; }
        public int? ParentId { get; set; }
    }
}
