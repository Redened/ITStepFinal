import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { WishlistService } from '../services/wishlist.service';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card';
import { ProductCardSkeletonComponent } from '../../../shared/components/skeleton/product-card-skeleton';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { ProductResponse } from '../../../shared/models';

@Component({
  selector: 'app-wishlist-page',
  imports: [ProductCardComponent, ProductCardSkeletonComponent, EmptyStateComponent],
  templateUrl: './wishlist-page.html',
  styleUrl: './wishlist-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WishlistPageComponent implements OnInit {
  private readonly wishlistService = inject(WishlistService);

  readonly products = signal<ProductResponse[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  /** Placeholder cards shown while the wishlist is loading. */
  readonly skeletons = Array.from({ length: 4 });

  // Re-reads the shared wishlist set so removed items disappear after a toggle.
  readonly visibleProducts = computed(() => {
    const ids = this.wishlistService.wishlistIds();
    return this.products().filter(p => ids.has(p.id));
  });

  readonly count = computed(() => this.visibleProducts().length);

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.wishlistService.getWishlist(1, 100).subscribe({
      next: res => {
        this.products.set((res.value?.items ?? []).map(i => i.product));
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Failed to load your wishlist. Please try again.');
      }
    });
  }
}
