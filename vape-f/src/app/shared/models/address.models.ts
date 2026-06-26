import { ApiResult } from './api-result.model';

export interface AddressResponse {
  id: number;
  title: string;
  fullName: string;
  line: string;
  city: string;
  postalCode: string | null;
  isDefault: boolean;
}

export interface CreateAddressRequest {
  title: string;
  fullName: string;
  line: string;
  city: string;
  postalCode: string | null;
  isDefault: boolean;
}

export type UpdateAddressRequest = Partial<CreateAddressRequest>;

export type AddressResponseListResult = ApiResult<AddressResponse[]>;
