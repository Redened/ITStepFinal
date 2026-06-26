import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NotificationService, NotificationType } from '../../../core/services/notification.service';

@Component({
  selector: 'app-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toast-container" aria-live="polite" aria-atomic="false" aria-label="Notifications">
      @for (n of notifications(); track n.id) {
        <div class="toast" [class]="'toast--' + n.type" role="alert">
          <span class="toast__icon" aria-hidden="true">
            @if (n.type === 'error')   { ✕ }
            @if (n.type === 'success') { ✓ }
            @if (n.type === 'warning') { ⚠ }
            @if (n.type === 'info')    { ℹ }
          </span>
          <p class="toast__message">{{ n.message }}</p>
          <button
            type="button"
            class="toast__close"
            (click)="dismiss(n.id)"
            [attr.aria-label]="'Dismiss notification: ' + n.message"
          >&#215;</button>
          <span
            class="toast__progress"
            aria-hidden="true"
            [style.animationDuration]="n.duration + 'ms'"
          ></span>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: calc(var(--navbar-height, 64px) + var(--spacing-sm));
      right: var(--spacing-md);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
      max-width: 400px;
      width: calc(100vw - var(--spacing-xl, 32px));
      pointer-events: none;
    }

    .toast {
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-sm);
      padding: 14px var(--spacing-md);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      font-size: var(--font-size-sm);
      font-weight: 500;
      line-height: 1.5;
      pointer-events: all;
      animation: toast-in 220ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes toast-in {
      from { opacity: 0; transform: translateX(24px) scale(0.96); }
      to   { opacity: 1; transform: translateX(0) scale(1); }
    }

    .toast--error   { background: #fff0f0; border: 1px solid #ffc9c9; color: #c92a2a; }
    .toast--success { background: #ebfbee; border: 1px solid #b2f2bb; color: #2f9e44; }
    .toast--warning { background: #fff9db; border: 1px solid #ffec99; color: #e67700; }
    .toast--info    { background: #e7f5ff; border: 1px solid #a5d8ff; color: #1971c2; }

    .toast__icon {
      font-size: 1rem;
      flex-shrink: 0;
      line-height: 1.5;
    }

    .toast__message {
      flex: 1;
      margin: 0;
    }

    .toast__close {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.25rem;
      line-height: 1;
      padding: 0;
      opacity: 0.6;
      flex-shrink: 0;
      color: inherit;
      transition: opacity var(--transition-fast);
    }

    .toast__close:hover { opacity: 1; }

    .toast__close:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 2px;
      border-radius: 3px;
    }

    .toast__progress {
      position: absolute;
      left: 0;
      bottom: 0;
      height: 3px;
      width: 100%;
      transform-origin: left;
      background: currentColor;
      opacity: 0.35;
      animation: toast-progress linear forwards;
    }

    @keyframes toast-progress {
      from { transform: scaleX(1); }
      to   { transform: scaleX(0); }
    }

    @media (prefers-reduced-motion: reduce) {
      .toast { animation: none; }
      .toast__progress { display: none; }
    }
  `]
})
export class ToastComponent {
  private readonly notificationService = inject(NotificationService);
  readonly notifications = this.notificationService.notifications;

  dismiss(id: number): void {
    this.notificationService.remove(id);
  }
}
