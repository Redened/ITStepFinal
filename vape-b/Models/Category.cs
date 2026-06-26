using VAPE.Common.Entities;

namespace VAPE.Models
{
    public class Category : Entity
    {
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public string? Description { get; set; }

        // Self-referencing hierarchy (optional parent → subcategories)
        public int? ParentId { get; set; }
        public Category? Parent { get; set; }
        public List<Category> SubCategories { get; set; } = new();

        // Relation with product (one to many)
        public List<Product> Products { get; set; } = new();
    }
}
