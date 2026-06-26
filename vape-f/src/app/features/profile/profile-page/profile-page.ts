import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthService } from '../../auth/services/auth.service';
import { AddressBookComponent } from '../address-book/address-book';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';

type Tab = 'profile' | 'security' | 'danger';

@Component({
  selector: 'app-profile-page',
  imports: [ReactiveFormsModule, AddressBookComponent, ConfirmDialogComponent],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilePageComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly activeTab = signal<Tab>('profile');

  readonly profileForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    address: [''],
    phoneNumber: ['']
  });

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: (res) => {
        if (res.value) {
          this.profileForm.patchValue({
            username: res.value.username || '',
            address: res.value.address || '',
            phoneNumber: res.value.phoneNumber || ''
          });
        }
      }
    });
  }

  readonly profileLoading = signal(false);
  readonly profileError = signal<string | null>(null);
  readonly profileSuccess = signal(false);

  readonly passwordForm = this.fb.group({
    oldPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]]
  });

  readonly passwordLoading = signal(false);
  readonly passwordError = signal<string | null>(null);
  readonly passwordSuccess = signal(false);

  readonly deleteLoading = signal(false);
  readonly deleteError = signal<string | null>(null);
  readonly deleteConfirmOpen = signal(false);

  get usernameCtrl() { return this.profileForm.controls.username; }
  get oldPasswordCtrl() { return this.passwordForm.controls.oldPassword; }
  get newPasswordCtrl() { return this.passwordForm.controls.newPassword; }

  setTab(tab: Tab): void {
    this.activeTab.set(tab);
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    const { username, address, phoneNumber } = this.profileForm.getRawValue();
    this.profileLoading.set(true);
    this.profileError.set(null);
    this.profileSuccess.set(false);

    this.userService.editProfile({
      username: username || null,
      address: address || null,
      phoneNumber: phoneNumber || null
    }).subscribe({
      next: () => {
        this.profileLoading.set(false);
        this.profileSuccess.set(true);
        setTimeout(() => this.profileSuccess.set(false), 3000);
      },
      error: (err: { error?: { message?: string } }) => {
        this.profileLoading.set(false);
        this.profileError.set(err.error?.message ?? 'Failed to update profile.');
      }
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    const { oldPassword, newPassword } = this.passwordForm.getRawValue();
    this.passwordLoading.set(true);
    this.passwordError.set(null);
    this.passwordSuccess.set(false);

    this.userService.changePassword({ oldPassword: oldPassword!, newPassword: newPassword! }).subscribe({
      next: () => {
        this.passwordLoading.set(false);
        this.passwordSuccess.set(true);
        this.passwordForm.reset();
        setTimeout(() => this.passwordSuccess.set(false), 3000);
      },
      error: (err: { error?: { message?: string } }) => {
        this.passwordLoading.set(false);
        this.passwordError.set(err.error?.message ?? 'Failed to change password.');
      }
    });
  }

  openDeleteConfirm(): void {
    this.deleteConfirmOpen.set(true);
  }

  cancelDelete(): void {
    this.deleteConfirmOpen.set(false);
    this.deleteError.set(null);
  }

  deleteAccount(): void {
    this.deleteLoading.set(true);
    this.deleteError.set(null);

    this.userService.deleteAccount().subscribe({
      next: () => {
        this.deleteLoading.set(false);
        this.authService.logout();
        this.router.navigate(['/auth/login']);
      },
      error: (err: { error?: { message?: string } }) => {
        this.deleteLoading.set(false);
        this.deleteConfirmOpen.set(false);
        this.deleteError.set(err.error?.message ?? 'Failed to delete account. Please try again.');
      }
    });
  }
}
