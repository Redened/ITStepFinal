import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

// Allows Admin or Manager (staff) into the admin area.
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isAuthenticated()) return router.createUrlTree(['/auth/login']);
  if (!auth.isStaff()) return router.createUrlTree(['/products']);
  return true;
};

// Restricts a route to Admin only (e.g. user management).
export const adminOnlyGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isAuthenticated()) return router.createUrlTree(['/auth/login']);
  if (!auth.isAdmin()) return router.createUrlTree(['/admin/products']);
  return true;
};
