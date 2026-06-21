import { ApiResult, PagedResult } from './api-result.model';

export interface EditUserRequest {
  username: string | null;
  address: string | null;
  phoneNumber: string | null;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export enum UserRoles {
  User = 0,
  Admin = 1,
  Manager = 2
}

export interface ProfileResponse {
  username: string;
  email: string;
  address?: string;
  phoneNumber?: string;
}

export interface UserResponse {
  id: number;
  username: string | null;
  email: string | null;
  isVerified: boolean;
  role: UserRoles;
}

export type UserResponsePaged = PagedResult<UserResponse>;
export type UserResponsePagedResult = ApiResult<UserResponsePaged>;
