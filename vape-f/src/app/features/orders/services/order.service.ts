import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { CheckoutRequest, OrderResponsePagedResult, OrderStatus } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/api/orders`;

  getOrders(status?: OrderStatus, page = 1, take = 10) {
    let params = new HttpParams()
      .set('Page', page)
      .set('Take', take);
    if (status != null) params = params.set('status', status);
    return this.http.get<OrderResponsePagedResult>(this.base, { params });
  }

  checkout(req: CheckoutRequest) {
    return this.http.post<void>(`${this.base}/checkout`, req);
  }

  confirmOrder(orderId: number) {
    return this.http.post<void>(`${this.base}/${orderId}/confirm`, null);
  }

  cancelOrder(orderId: number) {
    return this.http.post<void>(`${this.base}/${orderId}/cancel`, null);
  }

  deleteOrder(orderId: number) {
    return this.http.delete<void>(`${this.base}/${orderId}`);
  }
}
