import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  get usernameCtrl() {
    return this.form.controls.username;
  }
  get emailCtrl() {
    return this.form.controls.email;
  }
  get passwordCtrl() {
    return this.form.controls.password;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { username, email, password } = this.form.getRawValue();
    this.loading.set(true);
    this.error.set(null);
    this.authService
      .register({ username: username!, email: email!, password: password! })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/auth/verify-email'], { queryParams: { email: email } });
        },
        error: (err: { error?: { message?: string; errors?: string[] } }) => {
          this.loading.set(false);
          const msgs = err.error?.errors;
          this.error.set(msgs?.length ? msgs.join(' ') : (err.error?.message ?? ''));
        },
      });
  }
}
