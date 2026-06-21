import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResult, WishlistItemResponsePagedResult } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/api/wishlist`;

  // Set of product ids currently in the wishlist — drives the heart toggle state.
  readonly wishlistIds = signal<ReadonlySet<number>>(new Set<number>());

  isWishlisted(productId: number): boolean {
    return this.wishlistIds().has(productId);
  }

  getWishlist(page = 1, take = 20) {
    const params = new HttpParams().set('Page', page).set('Take', take);
    return this.http.get<WishlistItemResponsePagedResult>(this.base, { params });
  }

  /** Loads the set of wishlisted product ids (call once after login / on app start). */
  loadIds(): void {
    this.getWishlist(1, 1000).subscribe({
      next: res => {
        const ids = new Set((res.value?.items ?? []).map(i => i.product.id));
        this.wishlistIds.set(ids);
      },
      error: () => {}
    });
  }

  add(productId: number) {
    return this.http.post<ApiResult<number>>(this.base, { productId }).pipe(
      tap(() => this.mutateIds(ids => ids.add(productId)))
    );
  }

  remove(productId: number) {
    return this.http.delete<ApiResult<number>>(`${this.base}/${productId}`).pipe(
      tap(() => this.mutateIds(ids => ids.delete(productId)))
    );
  }

  private mutateIds(fn: (set: Set<number>) => void): void {
    const next = new Set(this.wishlistIds());
    fn(next);
    this.wishlistIds.set(next);
  }
}
