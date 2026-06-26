import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.adminRoutes),
  },
  {
    path: '',
    loadComponent: () =>
      import('./features/shell/main-layout/main-layout').then((m) => m.MainLayoutComponent),
    children: [
      {
        path: 'products',
        loadChildren: () =>
          import('./features/products/products.routes').then((m) => m.productRoutes),
      },
      {
        path: 'cart',
        canActivate: [authGuard],
        loadChildren: () => import('./features/cart/cart.routes').then((m) => m.cartRoutes),
      },
      {
        path: 'orders',
        canActivate: [authGuard],
        loadChildren: () => import('./features/orders/orders.routes').then((m) => m.orderRoutes),
      },
      {
        path: 'wishlist',
        canActivate: [authGuard],
        loadChildren: () =>
          import('./features/wishlist/wishlist.routes').then((m) => m.wishlistRoutes),
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        loadChildren: () =>
          import('./features/profile/profile.routes').then((m) => m.profileRoutes),
      },
      {
        path: 'about',
        loadComponent: () => import('./features/static-pages/about.component').then(m => m.AboutComponent)
      },
      {
        path: 'contact',
        loadComponent: () => import('./features/static-pages/contact.component').then(m => m.ContactComponent)
      },
      { path: '', redirectTo: 'products', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '/products' },
];
