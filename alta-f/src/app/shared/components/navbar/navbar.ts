import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  effect,
  viewChild,
  viewChildren,
  ElementRef
} from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { CartService } from '../../../features/cart/services/cart.service';
import { WishlistService } from '../../../features/wishlist/services/wishlist.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'onEscape()',
    '(document:click)': 'onDocumentClick($event)'
  }
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly router = inject(Router);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly cartCount = this.cartService.cartCount;
  readonly wishlistCount = computed(() => this.wishlistService.wishlistIds().size);
  readonly isStaff = this.authService.isStaff;
  readonly isAuthenticated = this.authService.isAuthenticated;

  // Mobile drawer.
  readonly menuOpen = signal(false);
  // Desktop account dropdown.
  readonly userMenuOpen = signal(false);

  private readonly userMenuTrigger = viewChild<ElementRef<HTMLElement>>('userMenuTrigger');
  private readonly userMenuItems = viewChildren<ElementRef<HTMLElement>>('userMenuItem');

  constructor() {
    // Move focus to the first item when the account menu opens (keyboard support).
    effect(() => {
      if (this.userMenuOpen()) {
        this.userMenuItems()[0]?.nativeElement.focus();
      }
    });
  }

  toggleMenu(): void {
    this.menuOpen.update(open => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  toggleUserMenu(): void {
    this.userMenuOpen.update(open => !open);
  }

  closeUserMenu(): void {
    this.userMenuOpen.set(false);
  }

  /** Roving focus + wrap-around within the open account menu. */
  onUserMenuKeydown(event: KeyboardEvent): void {
    const items = this.userMenuItems();
    if (items.length === 0) return;
    const current = items.findIndex(item => item.nativeElement === document.activeElement);

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        items[(current + 1) % items.length].nativeElement.focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        items[(current - 1 + items.length) % items.length].nativeElement.focus();
        break;
      case 'Home':
        event.preventDefault();
        items[0].nativeElement.focus();
        break;
      case 'End':
        event.preventDefault();
        items[items.length - 1].nativeElement.focus();
        break;
    }
  }

  onEscape(): void {
    if (this.userMenuOpen()) {
      this.userMenuOpen.set(false);
      this.userMenuTrigger()?.nativeElement.focus();
    }
    this.menuOpen.set(false);
  }

  onDocumentClick(event: MouseEvent): void {
    if (this.userMenuOpen() && !this.host.nativeElement.contains(event.target as Node)) {
      this.userMenuOpen.set(false);
    }
  }

  logout(): void {
    this.authService.logout();
    this.menuOpen.set(false);
    this.userMenuOpen.set(false);
    this.router.navigate(['/auth/login']);
  }
}
