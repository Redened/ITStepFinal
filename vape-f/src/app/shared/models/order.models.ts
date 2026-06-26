import { ApiResult, PagedResult } from './api-result.model';
import { ProductResponse } from './product.models';

export enum OrderStatus {
  Pending = 0,
  Confirmed = 1,
  Cancelled = 2,
  Deleted = 3,
  Delivered = 4
}

export enum DeliveryMethod {
  Standard = 0,
  Express = 1,
  Pickup = 2
}

export interface CheckoutRequest {
  shippingAddress: string | null;
}

export interface OrderItemResponse {
  id: number;
  quantity: number;
  price: number;
  product: ProductResponse;
}

export interface OrderResponse {
  id: number;
  status?: OrderStatus;
  totalAmount: number;
  shippingAddress: string | null;
  createdAt: string;
  orderItems: OrderItemResponse[] | null;
}

export type OrderResponsePaged = PagedResult<OrderResponse>;
export type OrderResponsePagedResult = ApiResult<OrderResponsePaged>;
