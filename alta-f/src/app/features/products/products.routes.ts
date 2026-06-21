import { Routes } from '@angular/router';

export const productRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./product-list/product-list').then(m => m.ProductListComponent)
  },
  {
    path: ':productId',
    loadComponent: () => import('./product-detail/product-detail').then(m => m.ProductDetailComponent)
  }
];
