import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  effect,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * Reusable accessible dialog shell.
 *
 * Renders an overlay + centered panel with `role="dialog"`, `aria-modal`,
 * focus trapping, Esc-to-close and backdrop-click-to-close. Content is
 * projected: pass `[modal-title]` for a custom header title (or use the
 * `title` input), default content for the body, and `[modal-footer]` for
 * the footer actions row. The footer hides itself when nothing is projected.
 *
 * The host controls visibility via the `open` input and reacts to `closed`.
 */
@Component({
  selector: 'app-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <div
        class="modal-overlay"
        (click)="onOverlayClick($event)"
        (keydown)="onKeydown($event)"
      >
        <div
          #panel
          class="modal"
          role="dialog"
          aria-modal="true"
          [attr.aria-label]="ariaLabel() || title() || null"
          tabindex="-1"
        >
          <div class="modal__header">
            @if (title()) {
              <h2 class="modal__title">{{ title() }}</h2>
            } @else {
              <ng-content select="[modal-title]" />
            }
            <button
              type="button"
              class="modal__close"
              aria-label="Close dialog"
              (click)="close()"
            >&#x2715;</button>
          </div>

          <div class="modal__body">
            <ng-content />
          </div>

          <div class="modal__footer">
            <ng-content select="[modal-footer]" />
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 500;
      padding: var(--spacing-md);
      animation: modal-overlay-in var(--transition-fast) ease;
    }

    .modal {
      background: var(--color-surface);
      border-radius: var(--radius-lg);
      width: 100%;
      max-width: 560px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: var(--shadow-lg);
      animation: modal-panel-in var(--transition-base) ease;

      &:focus {
        outline: none;
      }

      &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--spacing-md);
        padding: var(--spacing-lg) var(--spacing-lg) var(--spacing-md);
        border-bottom: 1px solid var(--color-border);
      }

      &__title {
        font-size: var(--font-size-lg);
        font-weight: 700;
        margin: 0;
      }

      &__close {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background: none;
        border: none;
        font-size: 1.2rem;
        line-height: 1;
        cursor: pointer;
        color: var(--color-text-muted);
        border-radius: var(--radius-sm);
        transition: color var(--transition-fast) ease;

        &:hover { color: var(--color-text); }
        &:focus-visible {
          outline: 2px solid var(--color-accent);
          outline-offset: 2px;
        }
      }

      &__body {
        padding: var(--spacing-lg);
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
      }

      &__footer {
        display: flex;
        justify-content: flex-end;
        gap: var(--spacing-sm);
        padding: var(--spacing-md) var(--spacing-lg) var(--spacing-lg);
        border-top: 1px solid var(--color-border);

        &:empty { display: none; }
      }
    }

    @keyframes modal-overlay-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes modal-panel-in {
      from { opacity: 0; transform: translateY(8px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @media (prefers-reduced-motion: reduce) {
      .modal-overlay,
      .modal {
        animation: none;
      }
    }
  `],
})
export class ModalComponent {
  /** Whether the dialog is shown. */
  readonly open = input(false);
  /** Optional header title (alternative to projecting `[modal-title]`). */
  readonly title = input('');
  /** Optional accessible label for the dialog (falls back to `title`). */
  readonly ariaLabel = input('');
  /** Emitted when the user requests to close (Esc, backdrop, or close button). */
  readonly closed = output<void>();

  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  private readonly document = inject(DOCUMENT);
  private previouslyFocused: HTMLElement | null = null;

  private static readonly FOCUSABLE =
    'a[href], button:not([disabled]), textarea:not([disabled]), ' +
    'input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  constructor() {
    effect(() => {
      if (this.open()) {
        this.previouslyFocused = this.document.activeElement as HTMLElement | null;
        this.document.body.style.overflow = 'hidden';
        // Defer until the panel is in the DOM, then move focus inside it.
        setTimeout(() => this.focusFirst());
      } else {
        this.document.body.style.overflow = '';
        const prev = this.previouslyFocused;
        this.previouslyFocused = null;
        prev?.focus?.();
      }
    });
  }

  close(): void {
    this.closed.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    // Only a click on the backdrop itself (not the panel) closes the dialog.
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      return;
    }
    if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  }

  private focusFirst(): void {
    const panel = this.panel()?.nativeElement;
    if (!panel) return;
    const focusables = this.getFocusable(panel);
    (focusables[0] ?? panel).focus();
  }

  private trapFocus(event: KeyboardEvent): void {
    const panel = this.panel()?.nativeElement;
    if (!panel) return;
    const focusables = this.getFocusable(panel);
    if (focusables.length === 0) {
      event.preventDefault();
      panel.focus();
      return;
    }
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = this.document.activeElement;

    if (event.shiftKey && (active === first || active === panel)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private getFocusable(panel: HTMLElement): HTMLElement[] {
    return Array.from(panel.querySelectorAll<HTMLElement>(ModalComponent.FOCUSABLE));
  }
}
