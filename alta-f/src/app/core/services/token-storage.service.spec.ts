import { TestBed } from '@angular/core/testing';
import { TokenStorageService } from './token-storage.service';

describe('TokenStorageService', () => {
  let service: TokenStorageService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenStorageService);
  });

  afterEach(() => localStorage.clear());

  it('stores and retrieves the access token', () => {
    service.setAccessToken('tok-123');
    expect(service.getAccessToken()).toBe('tok-123');
    expect(service.hasAccessToken()).toBe(true);
  });

  it('clears the access token', () => {
    service.setAccessToken('tok-123');
    service.clearAccessToken();
    expect(service.getAccessToken()).toBeNull();
    expect(service.hasAccessToken()).toBe(false);
  });

  it('reports no token initially', () => {
    expect(service.hasAccessToken()).toBe(false);
  });
});
