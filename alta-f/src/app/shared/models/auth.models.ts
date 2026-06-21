import { ApiResult } from './api-result.model';

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
}

export type TokenResponseResult = ApiResult<TokenResponse>;
