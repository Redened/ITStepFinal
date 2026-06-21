import { Component, ChangeDetectionStrategy, inject, signal, input } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-verify-email',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './verify-email.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerifyEmailComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly email = input<string>('');

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(4)]]
  });

  get codeCtrl() { return this.form.controls.code; }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const emailVal = this.email();
    if (!emailVal) {
      this.error.set('Email address is missing. Please register again.');
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    this.authService.verifyEmail({ email: emailVal, code: this.codeCtrl.value! }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/products']);
      },
      error: (err: { error?: { message?: string } }) => {
        this.loading.set(false);
        this.error.set(err.error?.message ?? 'Invalid or expired code.');
      }
    });
  }
}
