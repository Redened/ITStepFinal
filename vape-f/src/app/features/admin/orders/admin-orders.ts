import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit
} from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AdminService } from '../services/admin.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { OrderResponse, OrderStatus } from '../../../shared/models';

interface StatusOption {
  label: string;
  value: OrderStatus | null;
  badgeClass: string;
}

/** A status change awaiting confirmation (risky transitions only). */
interface PendingStatus {
  order: OrderResponse;
  status: OrderStatus;
  el: HTMLSelectElement;
}

@Component({
  selector: 'app-admin-orders',
  imports: [
    CurrencyPipe,
    DatePipe,
    PaginationComponent,
    EmptyStateComponent,
    PageHeaderComponent,
    SkeletonComponent,
    ConfirmDialogComponent,
  ],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminOrdersComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  readonly orders = signal<OrderResponse[]>([]);
  readonly loading = signal(true);
  readonly loadError = signal(false);
  readonly totalPages = signal(0);
  readonly currentPage = signal(1);
  readonly selectedStatus = signal<OrderStatus | null>(null);
  readonly actionLoadingId = signal<number | null>(null);
  readonly pendingStatus = signal<PendingStatus | null>(null);

  readonly isEmpty = computed(() => !this.loading() && !this.loadError() && this.orders().length === 0);

  /** Confirmation copy for a risky status change (Cancelled / Delivered). */
  readonly statusDialog = computed(() => {
    const p = this.pendingStatus();
    if (!p) return null;
    const label = this.statusLabel(p.status);
    const danger = p.status === OrderStatus.Cancelled;
    return {
      message: danger
        ? `Cancel order #${p.order.id}? The customer will be notified and this can't be undone.`
        : `Mark order #${p.order.id} as ${label}? This finalizes the order.`,
      confirmLabel: danger ? 'Cancel order' : `Mark ${label}`,
      variant: (danger ? 'danger' : 'primary') as 'danger' | 'primary',
    };
  });

  readonly statusOptions: StatusOption[] = [
    { label: 'All', value: null, badgeClass: 'badge-muted' },
    { label: 'Pending', value: OrderStatus.Pending, badgeClass: 'badge-warning' },
    { label: 'Confirmed', value: OrderStatus.Confirmed, badgeClass: 'badge-info' },
    { label: 'Cancelled', value: OrderStatus.Cancelled, badgeClass: 'badge-danger' },
    { label: 'Delivered', value: OrderStatus.Delivered, badgeClass: 'badge-success' }
  ];

  readonly allStatuses: OrderStatus[] = [
    OrderStatus.Pending,
    OrderStatus.Confirmed,
    OrderStatus.Cancelled,
    OrderStatus.Delivered
  ];

  ngOnInit(): void {
    this.loadOrders(1);
  }

  loadOrders(page: number): void {
    this.loading.set(true);
    this.loadError.set(false);
    const status = this.selectedStatus();
    this.adminService.getOrders(status ?? undefined, page, 10).subscribe({
      next: res => {
        this.orders.set(res.value?.items ?? []);
        this.totalPages.set(res.value?.totalPages ?? 0);
        this.currentPage.set(page);
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set(true);
        this.loading.set(false);
      }
    });
  }

  filterByStatus(status: OrderStatus | null): void {
    this.selectedStatus.set(status);
    this.loadOrders(1);
  }

  /** Risky transitions are confirmed before applying; safe ones apply at once. */
  private isRisky(status: OrderStatus): boolean {
    return status === OrderStatus.Cancelled || status === OrderStatus.Delivered;
  }

  onStatusSelect(order: OrderResponse, event: Event): void {
    const el = event.target as HTMLSelectElement;
    const status = Number(el.value) as OrderStatus;
    if (status === order.status) return;
    if (this.isRisky(status)) {
      this.pendingStatus.set({ order, status, el });
    } else {
      this.applyStatus(order.id, status);
    }
  }

  confirmStatus(): void {
    const p = this.pendingStatus();
    if (!p) return;
    this.applyStatus(p.order.id, p.status);
    this.pendingStatus.set(null);
  }

  cancelStatus(): void {
    const p = this.pendingStatus();
    // Revert the select back to the order's current status.
    if (p) p.el.value = String(p.order.status);
    this.pendingStatus.set(null);
  }

  private applyStatus(orderId: number, status: OrderStatus): void {
    this.actionLoadingId.set(orderId);
    this.adminService.updateOrderStatus(orderId, status).subscribe({
      next: () => {
        this.actionLoadingId.set(null);
        this.loadOrders(this.currentPage());
      },
      error: () => {
        this.actionLoadingId.set(null);
        this.loadOrders(this.currentPage());
      }
    });
  }

  statusLabel(status: OrderStatus | undefined): string {
    const map: Record<number, string> = {
      [OrderStatus.Pending]: 'Pending',
      [OrderStatus.Confirmed]: 'Confirmed',
      [OrderStatus.Cancelled]: 'Cancelled',
      [OrderStatus.Delivered]: 'Delivered'
    };
    return status != null ? (map[status] ?? 'Unknown') : '';
  }

  statusBadgeClass(status: OrderStatus | undefined): string {
    const map: Record<number, string> = {
      [OrderStatus.Pending]: 'badge-warning',
      [OrderStatus.Confirmed]: 'badge-info',
      [OrderStatus.Cancelled]: 'badge-danger',
      [OrderStatus.Delivered]: 'badge-success'
    };
    return status != null ? (map[status] ?? 'badge-muted') : 'badge-muted';
  }

  onPageChange(page: number): void {
    this.loadOrders(page);
  }
}
