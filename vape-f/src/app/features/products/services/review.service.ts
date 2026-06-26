import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResult, CreateReviewRequest, ReviewResponsePagedResult } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/api/reviews`;

  getForProduct(productId: number, page = 1, take = 10) {
    const params = new HttpParams().set('Page', page).set('Take', take);
    return this.http.get<ReviewResponsePagedResult>(`${this.base}/product/${productId}`, { params });
  }

  create(req: CreateReviewRequest) {
    return this.http.post<ApiResult<number>>(this.base, req);
  }
}
