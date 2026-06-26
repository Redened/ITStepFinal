import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly sent = signal(false);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  get emailCtrl() { return this.form.controls.email; }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const email = this.emailCtrl.value!;
    this.loading.set(true);
    this.error.set(null);
    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.loading.set(false);
        this.sent.set(true);
        setTimeout(() => {
          this.router.navigate(['/auth/reset-password'], { queryParams: { email } });
        }, 2000);
      },
      error: (err: { error?: { message?: string } }) => {
        this.loading.set(false);
        this.error.set(err.error?.message ?? 'Could not send reset email. Please try again.');
      }
    });
  }
}
