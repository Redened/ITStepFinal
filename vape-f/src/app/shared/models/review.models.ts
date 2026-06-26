import { ApiResult, PagedResult } from './api-result.model';

export interface ReviewResponse {
  id: number;
  rating: number;
  comment: string | null;
  username: string | null;
  createdAt: string;
}

export interface CreateReviewRequest {
  productId: number;
  rating: number;
  comment: string | null;
}

export type ReviewResponsePaged = PagedResult<ReviewResponse>;
export type ReviewResponsePagedResult = ApiResult<ReviewResponsePaged>;
