import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs/operators';
import { AuthService } from '../../auth/services/auth.service';

interface AdminNavItem {
  path: string;
  label: string;
  icon: string;
  adminOnly?: boolean;
}

interface AdminNavSection {
  heading: string;
  items: AdminNavItem[];
}

const NAV_SECTIONS: readonly AdminNavSection[] = [
  { heading: 'Overview', items: [{ path: 'dashboard', label: 'Dashboard', icon: 'dashboard' }] },
  {
    heading: 'Catalog',
    items: [
      { path: 'products', label: 'Products', icon: 'products' },
      { path: 'categories', label: 'Categories', icon: 'categories' }
    ]
  },
  { heading: 'Sales', items: [{ path: 'orders', label: 'Orders', icon: 'orders' }] },
  { heading: 'People', items: [{ path: 'users', label: 'Users', icon: 'users', adminOnly: true }] }
];

const COLLAPSE_KEY = 'admin-sidebar-collapsed';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'closeSidebar()'
  }
})
export class AdminLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isAdmin = this.authService.isAdmin;
  readonly role = this.authService.currentRole;

  // Mobile drawer open/closed.
  readonly sidebarOpen = signal(false);
  // Desktop icon-rail collapse (persisted).
  readonly collapsed = signal(this.readCollapsed());

  // Nav sections, hiding admin-only items (and any section left empty) for non-admins.
  readonly sections = computed<AdminNavSection[]>(() => {
    const admin = this.isAdmin();
    return NAV_SECTIONS
      .map(section => ({
        heading: section.heading,
        items: section.items.filter(item => !item.adminOnly || admin)
      }))
      .filter(section => section.items.length > 0);
  });

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => e.urlAfterRedirects),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );

  // Slim-topbar page context derived from the active admin route.
  readonly pageTitle = computed(() => {
    const url = this.currentUrl();
    const match = NAV_SECTIONS.flatMap(s => s.items).find(item => url.includes(`/admin/${item.path}`));
    return match?.label ?? 'Admin';
  });

  toggleSidebar(): void {
    this.sidebarOpen.update(open => !open);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  toggleCollapse(): void {
    this.collapsed.update(c => !c);
    this.persistCollapsed(this.collapsed());
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  private readCollapsed(): boolean {
    try {
      return localStorage.getItem(COLLAPSE_KEY) === '1';
    } catch {
      return false;
    }
  }

  private persistCollapsed(value: boolean): void {
    try {
      localStorage.setItem(COLLAPSE_KEY, value ? '1' : '0');
    } catch {
      // Ignore storage failures (e.g. private mode) — collapse still works in-memory.
    }
  }
}
