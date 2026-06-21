import { Component, ChangeDetectionStrategy, inject, signal, input, computed, effect } from '@angular/core';
import { CurrencyPipe, DecimalPipe, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CartService } from '../../cart/services/cart.service';
import { WishlistService } from '../../wishlist/services/wishlist.service';
import { ProductReviewsComponent } from '../product-reviews/product-reviews';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating';
import { ProductDetailsResponse } from '../../../shared/models';

@Component({
  selector: 'app-product-detail',
  imports: [CurrencyPipe, DecimalPipe, NgOptimizedImage, RouterLink, ProductReviewsComponent, StarRatingComponent],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);

  readonly productId = input.required<string>();
  readonly wishlistBusy = signal(false);

  readonly product = signal<ProductDetailsResponse | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly quantity = signal(1);
  readonly adding = signal(false);
  readonly addedSuccess = signal(false);
  readonly selectedImageIndex = signal(0);

  readonly allImages = computed(() => {
    const p = this.product();
    if (!p) return [];
    return [p.image, ...(p.gallery ?? [])].filter((img): img is string => !!img);
  });

  readonly selectedImage = computed(() => {
    const images = this.allImages();
    return images[this.selectedImageIndex()] ?? 'assets/placeholder.png';
  });

  readonly inStock = computed(() => (this.product()?.stock ?? 0) > 0);

  readonly hasDiscount = computed(() => {
    const p = this.product();
    return !!p && p.discount != null && p.discount > 0;
  });

  isWishlisted(): boolean {
    const p = this.product();
    return p ? this.wishlistService.isWishlisted(p.id) : false;
  }

  constructor() {
    effect(() => {
      const id = Number(this.productId());
      if (id) this.loadProduct(id);
    });
  }

  private loadProduct(id: number): void {
    this.loading.set(true);
    this.error.set(null);
    this.product.set(null);
    this.quantity.set(1);
    this.selectedImageIndex.set(0);

    this.productService.getProductById(id).subscribe({
      next: res => {
        this.product.set(res.value ?? null);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Product not found or failed to load.');
      }
    });
  }

  selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  increaseQty(): void {
    const max = this.product()?.stock ?? 99;
    this.quantity.update(q => Math.min(q + 1, max));
  }

  decreaseQty(): void {
    this.quantity.update(q => Math.max(1, q - 1));
  }

  addToCart(): void {
    const p = this.product();
    if (!p) return;
    this.adding.set(true);
    this.addedSuccess.set(false);
    this.cartService.addToCart({ productId: p.id, quantity: this.quantity() }).subscribe({
      next: () => {
        this.adding.set(false);
        this.addedSuccess.set(true);
        setTimeout(() => this.addedSuccess.set(false), 2500);
      },
      error: () => this.adding.set(false)
    });
  }

  toggleWishlist(): void {
    const p = this.product();
    if (!p) return;
    this.wishlistBusy.set(true);
    const call = this.isWishlisted()
      ? this.wishlistService.remove(p.id)
      : this.wishlistService.add(p.id);
    call.subscribe({
      next: () => this.wishlistBusy.set(false),
      error: () => this.wishlistBusy.set(false)
    });
  }

  // Reload the product so the average rating reflects a newly added review.
  onReviewSubmitted(): void {
    const id = Number(this.productId());
    if (id) this.loadProduct(id);
  }
}
