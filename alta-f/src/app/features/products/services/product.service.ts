import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {
  ProductResponsePagedResult,
  ProductDetailsResponseResult,
  ProductFilterParams
} from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/api/products`;

  getProducts(page = 1, take = 12) {
    const params = new HttpParams()
      .set('Page', page)
      .set('Take', take);
    return this.http.get<ProductResponsePagedResult>(this.base, { params });
  }

  filterProducts(filters: ProductFilterParams) {
    let params = new HttpParams();
    if (filters.Query)      params = params.set('Query', filters.Query);
    if (filters.MinPrice != null) params = params.set('MinPrice', filters.MinPrice);
    if (filters.MaxPrice != null) params = params.set('MaxPrice', filters.MaxPrice);
    if (filters.CategoryId != null) params = params.set('CategoryId', filters.CategoryId);
    if (filters.Page != null) params = params.set('Page', filters.Page);
    if (filters.Take != null) params = params.set('Take', filters.Take);
    return this.http.get<ProductResponsePagedResult>(`${this.base}/filter`, { params });
  }

  getProductById(productId: number) {
    return this.http.get<ProductDetailsResponseResult>(`${this.base}/${productId}`);
  }
}
