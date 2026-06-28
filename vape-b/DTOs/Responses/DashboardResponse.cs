namespace VAPE.DTOs.Responses
{
    public class DashboardResponse
    {
        public int TotalProducts { get; set; }
        public int TotalUsers { get; set; }
        public int TotalOrders { get; set; }
        public int PendingOrders { get; set; }
        public double TotalSales { get; set; }
        public int LowStockCount { get; set; }
        public List<ProductResponse> LowStockProducts { get; set; } = new();
        public List<TopProductResponse> TopProducts { get; set; } = new();
        public List<OrderResponse> RecentOrders { get; set; } = new();
        public List<UserResponse> RecentUsers { get; set; } = new();
    }

    public class TopProductResponse
    {
        public int ProductId { get; set; }
        public string Title { get; set; }
        public int UnitsSold { get; set; }
    }
}
