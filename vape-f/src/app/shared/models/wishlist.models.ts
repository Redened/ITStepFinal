import { ApiResult, PagedResult } from './api-result.model';
import { ProductResponse } from './product.models';

export interface WishlistItemResponse {
  id: number;
  product: ProductResponse;
}

export type WishlistItemResponsePaged = PagedResult<WishlistItemResponse>;
export type WishlistItemResponsePagedResult = ApiResult<WishlistItemResponsePaged>;
