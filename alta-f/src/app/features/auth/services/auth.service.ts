import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import {
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
  ResetPasswordRequest,
  TokenResponseResult
} from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly base = `${environment.apiUrl}/api/auth`;

  private readonly _isAuthenticated = signal(this.tokenStorage.hasAccessToken());
  readonly isAuthenticated = computed(() => this._isAuthenticated());

  readonly currentRole = computed<string | null>(() => {
    if (!this._isAuthenticated()) return null;
    const token = this.tokenStorage.getAccessToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))) as Record<string, unknown>;
      const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
        ?? payload['role'];
      return role == null ? null : String(role);
    } catch {
      return null;
    }
  });

  readonly isAdmin = computed(() => {
    const role = this.currentRole();
    return role === 'Admin' || role === '1';
  });

  readonly isManager = computed(() => {
    const role = this.currentRole();
    return role === 'Manager' || role === '2';
  });

  // Staff (Admin or Manager) may access the admin area.
  readonly isStaff = computed(() => this.isAdmin() || this.isManager());

  register(req: RegisterRequest) {
    return this.http.post<void>(`${this.base}/register`, req);
  }

  login(req: LoginRequest) {
    return this.http.post<TokenResponseResult>(`${this.base}/login`, req).pipe(
      tap(res => {
        if (res.value?.accessToken) {
          this.tokenStorage.setAccessToken(res.value.accessToken);
          this._isAuthenticated.set(true);
        }
      })
    );
  }

  verifyEmail(req: VerifyEmailRequest) {
    return this.http.put<TokenResponseResult>(`${this.base}/verify-email`, req).pipe(
      tap(res => {
        if (res.value?.accessToken) {
          this.tokenStorage.setAccessToken(res.value.accessToken);
          this._isAuthenticated.set(true);
        }
      })
    );
  }

  forgotPassword(email: string) {
    return this.http.post<void>(`${this.base}/forgot-password/${encodeURIComponent(email)}`, null);
  }

  resetPassword(req: ResetPasswordRequest) {
    return this.http.put<void>(`${this.base}/reset-password`, req);
  }

  logout() {
    this.tokenStorage.clearAccessToken();
    this._isAuthenticated.set(false);
  }
}
