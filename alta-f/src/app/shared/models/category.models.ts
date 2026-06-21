import { ApiResult } from './api-result.model';

export interface CategoryResponse {
  id: number;
  name: string | null;
  imageUrl: string | null;
  description: string | null;
  parentId: number | null;
}

export type CategoryResponseListResult = ApiResult<CategoryResponse[]>;

export interface CreateCategoryRequest {
  name: string | null;
  imageUrl: string | null;
  description: string | null;
  parentId: number | null;
}

export interface UpdateCategoryRequest {
  name: string | null;
  imageUrl: string | null;
  description: string | null;
  parentId: number | null;
}
