import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {
  Int32Result,
  CreateProductRequest,
  UpdateProductRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  OrderResponsePagedResult,
  OrderStatus,
  UserResponsePagedResult,
  UserRoles,
  DashboardResponseResult
} from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/api/admin`;

  // Analytics
  getDashboard() {
    return this.http.get<DashboardResponseResult>(`${this.base}/dashboard`);
  }

  // Products
  createProduct(req: CreateProductRequest) {
    return this.http.post<Int32Result>(`${this.base}/products`, req);
  }

  updateProduct(productId: number, req: UpdateProductRequest) {
    return this.http.put<Int32Result>(`${this.base}/products/${productId}`, req);
  }

  deleteProduct(productId: number) {
    return this.http.delete<Int32Result>(`${this.base}/products/${productId}`);
  }

  // Categories
  createCategory(req: CreateCategoryRequest) {
    return this.http.post<Int32Result>(`${this.base}/categories`, req);
  }

  updateCategory(categoryId: number, req: UpdateCategoryRequest) {
    return this.http.put<Int32Result>(`${this.base}/categories/${categoryId}`, req);
  }

  deleteCategory(categoryId: number) {
    return this.http.delete<Int32Result>(`${this.base}/categories/${categoryId}`);
  }

  // Orders
  getOrders(status?: OrderStatus, page = 1, take = 10) {
    let params = new HttpParams().set('Page', page).set('Take', take);
    if (status != null) params = params.set('status', status);
    return this.http.get<OrderResponsePagedResult>(`${this.base}/orders`, { params });
  }

  updateOrderStatus(orderId: number, status: OrderStatus) {
    const params = new HttpParams().set('status', status);
    return this.http.put<Int32Result>(`${this.base}/orders/${orderId}/status`, null, { params });
  }

  // Users
  getUsers(page = 1, take = 10) {
    const params = new HttpParams().set('Page', page).set('Take', take);
    return this.http.get<UserResponsePagedResult>(`${this.base}/users`, { params });
  }

  updateUserRole(userId: number, role: UserRoles) {
    const params = new HttpParams().set('role', role);
    return this.http.put<Int32Result>(`${this.base}/users/${userId}/role`, null, { params });
  }
}
