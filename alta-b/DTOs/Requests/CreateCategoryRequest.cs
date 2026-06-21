namespace ALTA.DTOs.Requests
{
    public class CreateCategoryRequest
    {
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public string? Description { get; set; }
        public int? ParentId { get; set; }
    }
}
