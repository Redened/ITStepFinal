import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { CurrencyPipe, DatePipe, NgOptimizedImage } from '@angular/common';
import { Observable } from 'rxjs';
import { OrderService } from '../services/order.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { DeliveryMethod, OrderResponse, OrderStatus } from '../../../shared/models';

interface StatusOption {
  label: string;
  value: OrderStatus | null;
}

type OrderAction = 'confirm' | 'cancel';

interface PendingAction {
  type: OrderAction;
  orderId: number;
}

interface TimelineStep {
  label: string;
  state: 'done' | 'current' | 'todo';
}

@Component({
  selector: 'app-orders-page',
  imports: [
    CurrencyPipe,
    DatePipe,
    NgOptimizedImage,
    PaginationComponent,
    ConfirmDialogComponent,
    EmptyStateComponent,
  ],
  templateUrl: './orders-page.html',
  styleUrl: './orders-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersPageComponent implements OnInit {
  private readonly orderService = inject(OrderService);

  readonly orders = signal<OrderResponse[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly totalPages = signal(0);
  readonly currentPage = signal(1);
  readonly selectedStatus = signal<OrderStatus | null>(null);
  readonly actionLoadingId = signal<number | null>(null);
  readonly actionError = signal<string | null>(null);
  readonly pendingAction = signal<PendingAction | null>(null);

  readonly statusOptions: StatusOption[] = [
    { label: 'All orders', value: null },
    { label: 'Pending', value: OrderStatus.Pending },
    { label: 'Confirmed', value: OrderStatus.Confirmed },
    { label: 'Delivered', value: OrderStatus.Delivered },
    { label: 'Cancelled', value: OrderStatus.Cancelled },
  ];

  private readonly timelineLabels = ['Pending', 'Confirmed', 'Delivered'];

  readonly isEmpty = computed(() => !this.loading() && this.orders().length === 0);

  /** Copy for the active confirm dialog, or null when none is open. */
  readonly dialogConfig = computed(() => {
    const action = this.pendingAction();
    if (!action) return null;
    switch (action.type) {
      case 'confirm':
        return {
          title: 'Confirm this order?',
          message: 'This marks the order as confirmed and ready for processing.',
          confirmLabel: 'Confirm order',
          variant: 'primary' as const,
        };
      case 'cancel':
        return {
          title: 'Cancel this order?',
          message: 'The order will be cancelled. This cannot be undone.',
          confirmLabel: 'Cancel order',
          variant: 'danger' as const,
        };
    }
  });

  ngOnInit(): void {
    this.loadOrders(1);
  }

  loadOrders(page: number): void {
    this.loading.set(true);
    this.error.set(null);
    const status = this.selectedStatus();
    this.orderService.getOrders(status ?? undefined, page, 10).subscribe({
      next: (res) => {
        this.orders.set(res.value?.items ?? []);
        this.totalPages.set(res.value?.totalPages ?? 0);
        this.currentPage.set(page);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Failed to load orders. Please try again.');
      },
    });
  }

  filterByStatus(status: OrderStatus | null): void {
    this.selectedStatus.set(status);
    this.loadOrders(1);
  }

  /** Open the confirm dialog for an action; the call only fires on confirmation. */
  requestAction(type: OrderAction, orderId: number): void {
    this.actionError.set(null);
    this.pendingAction.set({ type, orderId });
  }

  onActionCancelled(): void {
    if (this.actionLoadingId() != null) return; // don't dismiss mid-request
    this.pendingAction.set(null);
  }

  onActionConfirmed(): void {
    const action = this.pendingAction();
    if (!action) return;
    switch (action.type) {
      case 'confirm':
        this.runAction(this.orderService.confirmOrder(action.orderId), 'Could not confirm order.');
        break;
      case 'cancel':
        this.runAction(this.orderService.cancelOrder(action.orderId), 'Could not cancel order.');
        break;
    }
  }

  private runAction(call: Observable<void>, errorMsg: string, removeId?: number): void {
    const orderId = this.pendingAction()?.orderId;
    if (orderId == null) return;
    this.actionLoadingId.set(orderId);
    call.subscribe({
      next: () => {
        this.actionLoadingId.set(null);
        this.pendingAction.set(null);
        if (removeId != null) {
          this.orders.update((list) => list.filter((o) => o.id !== removeId));
        } else {
          this.loadOrders(this.currentPage());
        }
      },
      error: (err: { error?: { message?: string } }) => {
        this.actionLoadingId.set(null);
        this.pendingAction.set(null);
        this.actionError.set(err.error?.message ?? errorMsg);
      },
    });
  }

  isCancelled(order: OrderResponse): boolean {
    return order.status === OrderStatus.Cancelled;
  }

  private statusStepIndex(order: OrderResponse): number {
    switch (order.status) {
      case OrderStatus.Confirmed:
        return 1;
      case OrderStatus.Delivered:
        return 2;
      default:
        return 0; // Pending / null
    }
  }

  timeline(order: OrderResponse): TimelineStep[] {
    const current = this.statusStepIndex(order);
    return this.timelineLabels.map((label, i) => ({
      label,
      state: i < current ? 'done' : i === current ? 'current' : 'todo',
    }));
  }

  orderTotal(order: OrderResponse): number {
    // Prefer the amount captured at checkout; fall back to a computed sum
    // (using the item price snapshot) for legacy orders.
    if (order.totalAmount) return order.totalAmount;
    return (order.orderItems ?? []).reduce(
      (sum, item) => sum + item.quantity * (item.price || item.product.price),
      0,
    );
  }

  deliveryLabel(method: DeliveryMethod | undefined): string {
    const map: Record<number, string> = {
      [DeliveryMethod.Standard]: 'Standard',
      [DeliveryMethod.Express]: 'Express',
      [DeliveryMethod.Pickup]: 'Pickup',
    };
    return method != null ? (map[method] ?? 'Standard') : 'Standard';
  }

  statusLabel(status: OrderStatus | undefined): string {
    const map: Record<number, string> = {
      [OrderStatus.Pending]: 'Pending',
      [OrderStatus.Confirmed]: 'Confirmed',
      [OrderStatus.Cancelled]: 'Cancelled',
      [OrderStatus.Delivered]: 'Delivered',
    };
    return status != null ? (map[status] ?? 'Unknown') : '';
  }

  statusBadgeClass(status: OrderStatus | undefined): string {
    const map: Record<number, string> = {
      [OrderStatus.Pending]: 'badge-warning',
      [OrderStatus.Confirmed]: 'badge-info',
      [OrderStatus.Cancelled]: 'badge-danger',
      [OrderStatus.Delivered]: 'badge-success',
    };
    return status != null ? (map[status] ?? 'badge-muted') : 'badge-muted';
  }

  canConfirm(order: OrderResponse): boolean {
    return order.status == null || order.status === OrderStatus.Pending;
  }

  canCancel(order: OrderResponse): boolean {
    return order.status == null || order.status === OrderStatus.Pending;
  }

  onPageChange(page: number): void {
    this.loadOrders(page);
  }
}
