import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {
  ApiResult,
  AddressResponseListResult,
  CreateAddressRequest,
  UpdateAddressRequest
} from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class AddressService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/api/addresses`;

  getAddresses() {
    return this.http.get<AddressResponseListResult>(this.base);
  }

  create(req: CreateAddressRequest) {
    return this.http.post<ApiResult<number>>(this.base, req);
  }

  update(addressId: number, req: UpdateAddressRequest) {
    return this.http.put<ApiResult<number>>(`${this.base}/${addressId}`, req);
  }

  delete(addressId: number) {
    return this.http.delete<ApiResult<number>>(`${this.base}/${addressId}`);
  }
}
