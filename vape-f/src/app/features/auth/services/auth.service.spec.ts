import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { TokenStorageService } from '../../../core/services/token-storage.service';

// Builds a JWT-shaped token whose payload carries the given role claim.
function makeToken(role: string): string {
  const payload = btoa(JSON.stringify({ role }));
  return `header.${payload}.signature`;
}

describe('AuthService role detection', () => {
  let tokenStorage: TokenStorageService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    tokenStorage = TestBed.inject(TokenStorageService);
  });

  afterEach(() => localStorage.clear());

  it('recognises an Admin as admin and staff', () => {
    tokenStorage.setAccessToken(makeToken('Admin'));
    const auth = TestBed.inject(AuthService);
    expect(auth.isAdmin()).toBe(true);
    expect(auth.isManager()).toBe(false);
    expect(auth.isStaff()).toBe(true);
  });

  it('recognises a Manager as staff but not admin', () => {
    tokenStorage.setAccessToken(makeToken('Manager'));
    const auth = TestBed.inject(AuthService);
    expect(auth.isAdmin()).toBe(false);
    expect(auth.isManager()).toBe(true);
    expect(auth.isStaff()).toBe(true);
  });

  it('treats a plain User as non-staff', () => {
    tokenStorage.setAccessToken(makeToken('User'));
    const auth = TestBed.inject(AuthService);
    expect(auth.isAdmin()).toBe(false);
    expect(auth.isManager()).toBe(false);
    expect(auth.isStaff()).toBe(false);
  });

  it('reports not authenticated when no token is present', () => {
    const auth = TestBed.inject(AuthService);
    expect(auth.isAuthenticated()).toBe(false);
    expect(auth.isStaff()).toBe(false);
  });
});
