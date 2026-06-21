import { ApiResult, PagedResult } from './api-result.model';
import { CategoryResponse } from './category.models';

export enum ProductStatus {
  Active = 0,
  Inactive = 1
}

export interface ProductResponse {
  id: number;
  title: string | null;
  stock: number;
  price: number;
  discount: number | null;
  discountedPrice: number;
  image: string | null;
  status: ProductStatus;
  averageRating: number;
  reviewCount: number;
}

export interface ProductDetailsResponse {
  id: number;
  title: string | null;
  description: string | null;
  stock: number;
  price: number;
  discount: number | null;
  discountedPrice: number;
  image: string | null;
  gallery: string[] | null;
  category: CategoryResponse;
  status: ProductStatus;
  averageRating: number;
  reviewCount: number;
}

export interface ProductFilterParams {
  Query?: string;
  MinPrice?: number;
  MaxPrice?: number;
  CategoryId?: number;
  Page?: number;
  Take?: number;
}

export interface CreateProductRequest {
  title: string | null;
  description: string | null;
  stock: number;
  price: number;
  image: string | null;
  gallery: string[] | null;
  categoryId: number;
  status: ProductStatus;
  discount: number | null;
}

export interface UpdateProductRequest {
  title?: string | null;
  description?: string | null;
  stock?: number | null;
  price?: number | null;
  image?: string | null;
  gallery?: string[] | null;
  categoryId?: number | null;
  status?: ProductStatus | null;
  discount?: number | null;
}

export type ProductResponsePaged = PagedResult<ProductResponse>;
export type ProductResponsePagedResult = ApiResult<ProductResponsePaged>;
export type ProductDetailsResponseResult = ApiResult<ProductDetailsResponse>;
