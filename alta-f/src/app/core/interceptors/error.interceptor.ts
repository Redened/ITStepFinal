import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { TokenStorageService } from '../services/token-storage.service';

function extractMessage(error: HttpErrorResponse): string {
  const body = error.error;
  if (typeof body === 'string' && body.length < 200) return body;
  if (body?.message) return body.message;
  if (Array.isArray(body?.errors) && body.errors.length) return body.errors.join(' ');
  return defaultMessage(error.status);
}

function defaultMessage(status: number): string {
  if (status === 0)   return 'Network error — please check your connection.';
  if (status === 403) return 'You do not have permission to perform this action.';
  if (status === 404) return 'The requested resource was not found.';
  if (status === 409) return 'A conflict occurred. The resource may already exist.';
  if (status === 422) return 'Validation failed. Please check your input.';
  if (status >= 500)  return 'Server error — please try again later.';
  return 'An unexpected error occurred.';
}

const AUTH_PATHS = ['/api/auth/login', '/api/auth/register', '/api/auth/verify-email', '/api/auth/reset-password', '/api/auth/forgot-password'];

function isAuthEndpoint(url: string): boolean {
  return AUTH_PATHS.some(path => url.includes(path));
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationService);
  const tokenStorage = inject(TokenStorageService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        if (!isAuthEndpoint(req.url)) {
          tokenStorage.clearAccessToken();
          notifications.warning('Your session has expired. Please sign in again.');
          router.navigate(['/auth/login']);
        }
        return throwError(() => error);
      }

      if (isAuthEndpoint(req.url)) {
        return throwError(() => error);
      }

      if (error.status === 0 || error.status === 403 || error.status >= 500) {
        notifications.error(extractMessage(error));
      } else if (error.status >= 400) {
        notifications.error(extractMessage(error));
      }

      return throwError(() => error);
    })
  );
};
