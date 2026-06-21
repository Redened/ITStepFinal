import { Routes } from '@angular/router';

export const orderRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./orders-page/orders-page').then(m => m.OrdersPageComponent)
  }
];
