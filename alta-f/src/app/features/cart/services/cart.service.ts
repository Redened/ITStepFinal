import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
  AddToCartDto,
  EditCartDto,
  CartItemResponsePagedResult
} from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/api/cart`;

  readonly cartCount = signal(0);

  getCart(page = 1, take = 20) {
    const params = new HttpParams()
      .set('Page', page)
      .set('Take', take);
    return this.http.get<CartItemResponsePagedResult>(this.base, { params }).pipe(
      tap(res => this.cartCount.set(res.value?.totalCount ?? 0))
    );
  }

  addToCart(dto: AddToCartDto) {
    return this.http.post<void>(this.base, dto).pipe(
      tap(() => this.cartCount.update(n => n + dto.quantity))
    );
  }

  editCart(dto: EditCartDto) {
    return this.http.put<void>(this.base, dto);
  }

  removeFromCart(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`).pipe(
      tap(() => this.cartCount.update(n => Math.max(0, n - 1)))
    );
  }

  refreshCount() {
    const params = new HttpParams().set('Page', 1).set('Take', 1);
    return this.http.get<CartItemResponsePagedResult>(this.base, { params }).pipe(
      tap(res => this.cartCount.set(res.value?.totalCount ?? 0))
    );
  }
}
