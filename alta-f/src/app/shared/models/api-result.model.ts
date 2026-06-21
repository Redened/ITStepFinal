export interface ApiResult<T> {
  status: number;
  value: T;
  message: string | null;
  errors: string[] | null;
}

export interface PagedResult<T> {
  items: T[] | null;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  currentPage: number;
  pageSize: number;
}

export type Int32Result = ApiResult<number>;
