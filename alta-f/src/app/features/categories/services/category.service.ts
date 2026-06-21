import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { CategoryResponseListResult } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/api/categories`;

  getCategories() {
    return this.http.get<CategoryResponseListResult>(this.base);
  }
}
