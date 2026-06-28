import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { CurrencyPipe, SlicePipe, DatePipe } from '@angular/common';
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
    DatePipe,
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

  readonly liveActivities = computed(() => {
    const d = this.data();
    if (!d) return [];
    
    const items: any[] = [];

    d.recentOrders?.forEach(o => {
      items.push({
        type: 'order',
        iconClass: 'bg-success',
        iconSvg: '<polyline points="20 6 9 17 4 12"></polyline>',
        html: `<strong>New Order #${o.id}</strong> placed by ${o.user?.username || 'Customer'}.`,
        date: new Date(o.createdAt)
      });
    });

    d.recentUsers?.forEach(u => {
      items.push({
        type: 'user',
        iconClass: 'bg-info',
        iconSvg: '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>',
        html: `<strong>New User</strong>: ${u.username} registered.`,
        date: new Date(u.createdAt)
      });
    });

    d.lowStockProducts?.forEach(p => {
      items.push({
        type: 'stock',
        iconClass: 'bg-warning',
        iconSvg: '<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17.5" y1="15" x2="9" y2="6.5"></line>',
        html: `<strong>Stock Alert</strong>: ${p.title} is running low (${p.stock} left).`,
        date: new Date()
      });
    });

    return items.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10);
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
