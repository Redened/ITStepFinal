import { ApiResult, PagedResult } from './api-result.model';
import { ProductResponse } from './product.models';

export interface AddToCartDto {
  productId: number;
  quantity: number;
}

export interface EditCartDto {
  itemId: number;
  quantity: number;
}

export interface CartItemResponse {
  id: number;
  quantity: number;
  product: ProductResponse;
}

export type CartItemResponsePaged = PagedResult<CartItemResponse>;
export type CartItemResponsePagedResult = ApiResult<CartItemResponsePaged>;
