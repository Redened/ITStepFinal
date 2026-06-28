import { ApiResult } from './api-result.model';
import { ProductResponse } from './product.models';

export interface TopProductResponse {
  productId: number;
  title: string | null;
  unitsSold: number;
}

export interface DashboardResponse {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  pendingOrders: number;
  totalSales: number;
  lowStockCount: number;
  lowStockProducts: ProductResponse[];
  topProducts: TopProductResponse[];
  recentOrders: any[];
  recentUsers: any[];
}

export type DashboardResponseResult = ApiResult<DashboardResponse>;
