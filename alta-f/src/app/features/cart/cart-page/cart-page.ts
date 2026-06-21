import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';
import { OrderService } from '../../orders/services/order.service';
import { AddressService } from '../../profile/services/address.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { CartItemResponse, ProductResponse, DeliveryMethod } from '../../../shared/models';

@Component({
  selector: 'app-cart-page',
  imports: [CurrencyPipe, NgOptimizedImage, RouterLink, ReactiveFormsModule, EmptyStateComponent],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartPageComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly orderService = inject(OrderService);
  private readonly addressService = inject(AddressService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly DeliveryMethod = DeliveryMethod;

  readonly checkoutForm = this.fb.nonNullable.group({
    shippingAddress: ['', [Validators.required, Validators.minLength(5)]],
    paymentMethod: ['Cash on delivery', [Validators.required]],
    deliveryMethod: [DeliveryMethod.Standard, [Validators.required]]
  });

  readonly cartItems = signal<CartItemResponse[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly updatingId = signal<number | null>(null);
  readonly checkoutLoading = signal(false);
  readonly checkoutError = signal<string | null>(null);

  /** Per-unit price actually charged: the discounted price when on sale, else list price. */
  unitPrice(product: ProductResponse): number {
    return product.discount != null && product.discount > 0
      ? product.discountedPrice
      : product.price;
  }

  lineTotal(item: CartItemResponse): number {
    return item.quantity * this.unitPrice(item.product);
  }

  readonly total = computed(() =>
    this.cartItems().reduce((sum, item) => sum + this.lineTotal(item), 0)
  );

  /** Total saved vs. list price across the cart (0 when nothing is discounted). */
  readonly savings = computed(() =>
    this.cartItems().reduce(
      (sum, item) => sum + item.quantity * (item.product.price - this.unitPrice(item.product)),
      0
    )
  );

  readonly itemCount = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );

  ngOnInit(): void {
    this.loadCart();
    this.loadDefaultAddress();
  }

  private loadDefaultAddress(): void {
    this.addressService.getAddresses().subscribe({
      next: (res) => {
        const addresses = res.value || [];
        if (addresses.length > 0) {
          const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
          const parts = [defaultAddr.fullName, defaultAddr.line, defaultAddr.city, defaultAddr.postalCode];
          const addressString = parts.filter(p => !!p).join(', ').trim();
          this.checkoutForm.patchValue({ shippingAddress: addressString });
        }
      }
    });
  }

  private loadCart(): void {
    this.loading.set(true);
    this.cartService.getCart(1, 100).subscribe({
      next: res => {
        this.cartItems.set(res.value?.items ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Failed to load your cart. Please try again.');
      }
    });
  }

  updateQuantity(itemId: number, delta: number): void {
    const item = this.cartItems().find(i => i.id === itemId);
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty < 1 || newQty > item.product.stock) return;

    this.updatingId.set(itemId);
    this.cartService.editCart({ itemId, quantity: newQty }).subscribe({
      next: () => {
        this.cartItems.update(items =>
          items.map(i => i.id === itemId ? { ...i, quantity: newQty } : i)
        );
        this.updatingId.set(null);
      },
      error: () => this.updatingId.set(null)
    });
  }

  removeItem(id: number): void {
    this.updatingId.set(id);
    this.cartService.removeFromCart(id).subscribe({
      next: () => {
        this.cartItems.update(items => items.filter(i => i.id !== id));
        this.updatingId.set(null);
      },
      error: () => this.updatingId.set(null)
    });
  }

  checkout(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const { shippingAddress, paymentMethod, deliveryMethod } = this.checkoutForm.getRawValue();

    this.checkoutLoading.set(true);
    this.checkoutError.set(null);
    this.orderService.checkout({ shippingAddress, paymentMethod, deliveryMethod }).subscribe({
      next: () => {
        this.checkoutLoading.set(false);
        this.cartService.cartCount.set(0);
        this.router.navigate(['/orders']);
      },
      error: (err: { error?: { message?: string } }) => {
        this.checkoutLoading.set(false);
        this.checkoutError.set(err.error?.message ?? 'Checkout failed. Please try again.');
      }
    });
  }
}
