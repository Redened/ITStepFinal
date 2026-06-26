import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { EditUserRequest, ChangePasswordRequest, ProfileResponse, ApiResult } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/api/users`;

  getProfile() {
    return this.http.get<ApiResult<ProfileResponse>>(`${this.base}/profile`);
  }

  editProfile(req: EditUserRequest) {
    return this.http.put<void>(`${this.base}/edit`, req);
  }

  changePassword(req: ChangePasswordRequest) {
    return this.http.put<void>(`${this.base}/change-password`, req);
  }

  deleteAccount() {
    return this.http.delete<void>(this.base);
  }
}
