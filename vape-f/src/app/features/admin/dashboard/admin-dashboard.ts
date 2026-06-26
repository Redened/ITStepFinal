import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { CurrencyPipe, SlicePipe } from '@angular/common';
import { AdminService } from '../services/admin.service';
import { DashboardResponse, TopProductResponse } from '../../../shared/models';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton';

/** A top product with its bar width as a percentage of the best seller. */
interface TopProductBar extends TopProductResponse {
  percent: number;
}

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    CurrencyPipe,
    SkeletonComponent,
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboardComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  readonly data = signal<DashboardResponse | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  /** Top products with a relative bar width (best seller = 100%). */
  readonly topProductBars = computed<TopProductBar[]>(() => {
    const top = this.data()?.topProducts ?? [];
    const max = Math.max(1, ...top.map(p => p.unitsSold));
    return top.map(p => ({ ...p, percent: Math.round((p.unitsSold / max) * 100) }));
  });

  ngOnInit(): void {
    this.adminService.getDashboard().subscribe({
      next: res => {
        this.data.set(res.value ?? null);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Failed to load dashboard data.');
      }
    });
  }
}
