import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit
} from '@angular/core';
import { AdminService } from '../services/admin.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { UserResponse, UserRoles } from '../../../shared/models';

/** A role change awaiting confirmation. */
interface PendingRole {
  user: UserResponse;
  role: UserRoles;
  el: HTMLSelectElement;
}

@Component({
  selector: 'app-admin-users',
  imports: [
    PaginationComponent,
    EmptyStateComponent,
    PageHeaderComponent,
    SkeletonComponent,
    ConfirmDialogComponent,
  ],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminUsersComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  readonly users = signal<UserResponse[]>([]);
  readonly loading = signal(true);
  readonly loadError = signal(false);
  readonly totalPages = signal(0);
  readonly currentPage = signal(1);
  readonly actionLoadingId = signal<number | null>(null);
  readonly pendingRole = signal<PendingRole | null>(null);

  readonly isEmpty = computed(() => !this.loading() && !this.loadError() && this.users().length === 0);

  /** Confirmation copy for a role change (danger when granting Admin). */
  readonly roleDialog = computed(() => {
    const p = this.pendingRole();
    if (!p) return null;
    const from = this.roleLabel(p.user.role);
    const to = this.roleLabel(p.role);
    const danger = p.role === UserRoles.Admin;
    return {
      message: `Change ${p.user.username}'s role from ${from} to ${to}?`,
      confirmLabel: `Make ${to}`,
      variant: (danger ? 'danger' : 'primary') as 'danger' | 'primary',
    };
  });

  readonly UserRoles = UserRoles;

  ngOnInit(): void {
    this.loadUsers(1);
  }

  loadUsers(page: number): void {
    this.loading.set(true);
    this.loadError.set(false);
    this.adminService.getUsers(page, 10).subscribe({
      next: res => {
        this.users.set(res.value?.items ?? []);
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

  onRoleSelect(user: UserResponse, event: Event): void {
    const el = event.target as HTMLSelectElement;
    const role = Number(el.value) as UserRoles;
    if (role === user.role) return;
    this.pendingRole.set({ user, role, el });
  }

  confirmRole(): void {
    const p = this.pendingRole();
    if (!p) return;
    this.applyRole(p.user.id, p.role);
    this.pendingRole.set(null);
  }

  cancelRole(): void {
    const p = this.pendingRole();
    // Revert the select back to the user's current role.
    if (p) p.el.value = String(p.user.role);
    this.pendingRole.set(null);
  }

  private applyRole(userId: number, role: UserRoles): void {
    this.actionLoadingId.set(userId);
    this.adminService.updateUserRole(userId, role).subscribe({
      next: () => {
        this.actionLoadingId.set(null);
        this.users.update(list =>
          list.map(u => u.id === userId ? { ...u, role } : u)
        );
      },
      error: () => {
        this.actionLoadingId.set(null);
        // Resync the selects with server truth after a failed change.
        this.loadUsers(this.currentPage());
      }
    });
  }

  roleLabel(role: UserRoles): string {
    switch (role) {
      case UserRoles.Admin: return 'Admin';
      case UserRoles.Manager: return 'Manager';
      default: return 'User';
    }
  }

  roleBadgeClass(role: UserRoles): string {
    switch (role) {
      case UserRoles.Admin: return 'badge-info';
      case UserRoles.Manager: return 'badge-warning';
      default: return 'badge-muted';
    }
  }

  onPageChange(page: number): void {
    this.loadUsers(page);
  }
}
