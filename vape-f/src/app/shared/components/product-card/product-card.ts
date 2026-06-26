import { Component, ChangeDetectionStrategy, inject, signal, computed, input } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { CartService } from '../../../features/cart/services/cart.service';
import { WishlistService } from '../../../features/wishlist/services/wishlist.service';
import { StarRatingComponent } from '../star-rating/star-rating';
import { ProductResponse } from '../../models';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, NgOptimizedImage, StarRatingComponent],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly router = inject(Router);

  readonly product = input.required<ProductResponse>();
  readonly adding = signal(false);
  readonly wishlistBusy = signal(false);

  readonly imageSrc = computed(() => {
    const img = this.product().image;
    if (!img) return '/assets/placeholder.png';
    return img.startsWith('/') || img.startsWith('http') ? img : '/' + img;
  });
  readonly hasDiscount = computed(() => {
    const d = this.product().discount;
    return d != null && d > 0;
  });
  readonly outOfStock = computed(() => this.product().stock === 0);
  readonly lowStock = computed(() => {
    const s = this.product().stock;
    return s > 0 && s <= 5;
  });

  isWishlisted(): boolean {
    return this.wishlistService.isWishlisted(this.product().id);
  }

  navigateToDetail(): void {
    this.router.navigate(['/products', this.product().id]);
  }

  addToCart(event: Event): void {
    event.stopPropagation();
    this.adding.set(true);
    this.cartService.addToCart({ productId: this.product().id, quantity: 1 }).subscribe({
      next: () => this.adding.set(false),
      error: () => this.adding.set(false)
    });
  }

  toggleWishlist(event: Event): void {
    event.stopPropagation();
    const id = this.product().id;
    this.wishlistBusy.set(true);
    const call = this.isWishlisted()
      ? this.wishlistService.remove(id)
      : this.wishlistService.add(id);
    call.subscribe({
      next: () => this.wishlistBusy.set(false),
      error: () => this.wishlistBusy.set(false)
    });
  }
}
