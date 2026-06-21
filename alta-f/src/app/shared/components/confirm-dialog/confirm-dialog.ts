import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { ModalComponent } from '../modal/modal';

/**
 * Consistent confirmation dialog for destructive or important actions
 * (delete product/category/account, cancel order, …).
 *
 * Wraps {@link ModalComponent}: the host controls visibility via `open` and
 * reacts to `confirmed` / `cancelled`. Esc, the backdrop, the close button and
 * the cancel button all emit `cancelled`; only the primary button emits
 * `confirmed`. Set `loading` to disable the confirm button while the action is
 * in flight. `variant` picks the confirm button colour (`danger` by default,
 * since this is most often used for destructive flows).
 */
@Component({
  selector: 'app-confirm-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModalComponent],
  template: `
    <app-modal
      [open]="open()"
      [title]="title()"
      [ariaLabel]="title()"
      (closed)="cancel()"
    >
      <p class="confirm__message">{{ message() }}</p>

      <ng-container modal-footer>
        <button
          type="button"
          class="btn btn-secondary"
          [disabled]="loading()"
          (click)="cancel()"
        >{{ cancelLabel() }}</button>
        <button
          type="button"
          class="btn"
          [class.btn-danger]="variant() === 'danger'"
          [class.btn-primary]="variant() === 'primary'"
          [disabled]="loading()"
          (click)="confirm()"
        >{{ loading() ? 'Working…' : confirmLabel() }}</button>
      </ng-container>
    </app-modal>
  `,
  styles: [`
    .confirm__message {
      margin: 0;
      color: var(--color-text);
      line-height: 1.5;
    }
  `],
})
export class ConfirmDialogComponent {
  /** Whether the dialog is shown. */
  readonly open = input(false);
  /** Heading shown in the dialog. */
  readonly title = input('Are you sure?');
  /** Body text describing the consequence of confirming. */
  readonly message = input('');
  /** Label for the confirm button. */
  readonly confirmLabel = input('Confirm');
  /** Label for the cancel button. */
  readonly cancelLabel = input('Cancel');
  /** Confirm button style — `danger` for destructive actions, `primary` otherwise. */
  readonly variant = input<'danger' | 'primary'>('danger');
  /** Disables the buttons while the confirmed action is in flight. */
  readonly loading = input(false);

  /** Emitted when the user confirms the action. */
  readonly confirmed = output<void>();
  /** Emitted when the user dismisses the dialog (cancel, Esc, backdrop, close). */
  readonly cancelled = output<void>();

  confirm(): void {
    this.confirmed.emit();
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
