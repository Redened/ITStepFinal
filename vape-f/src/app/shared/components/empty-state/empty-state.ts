import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * One consistent "no data" placeholder: an optional icon, a title, a
 * supporting message and an optional call to action.
 *
 * Project an icon (SVG/emoji) into the `[empty-icon]` slot. The CTA renders as
 * a router link when `ctaLink` is set, otherwise as a button that emits
 * `ctaClick`; if neither `ctaLabel` is provided nor a `[empty-cta]` slot is
 * projected, no action is shown. For full control, project custom actions into
 * the `[empty-cta]` slot instead of using the `ctaLabel`/`ctaLink` inputs.
 */
@Component({
  selector: 'app-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="empty">
      <div class="empty__icon" aria-hidden="true">
        <ng-content select="[empty-icon]" />
      </div>

      <h2 class="empty__title">{{ title() }}</h2>

      @if (message()) {
        <p class="empty__message">{{ message() }}</p>
      }

      @if (ctaLabel()) {
        @if (ctaLink()) {
          <a class="btn btn-primary empty__cta" [routerLink]="ctaLink()">{{ ctaLabel() }}</a>
        } @else {
          <button type="button" class="btn btn-primary empty__cta" (click)="ctaClick.emit()">
            {{ ctaLabel() }}
          </button>
        }
      }

      <ng-content select="[empty-cta]" />
    </div>
  `,
  styles: [`
    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-3xl) var(--spacing-lg);
      color: var(--color-text-muted);
    }

    .empty__icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      margin-bottom: var(--spacing-xs);
      color: var(--color-text-muted);
      opacity: 0.7;

      :where(svg) {
        width: 100%;
        height: 100%;
      }

      :where(img) {
        max-width: 100%;
        max-height: 100%;
      }

      &:empty { display: none; }
    }

    .empty__title {
      margin: 0;
      font-size: var(--font-size-lg);
      font-weight: 700;
      color: var(--color-text);
    }

    .empty__message {
      margin: 0;
      max-width: 42ch;
      line-height: 1.5;
    }

    .empty__cta {
      margin-top: var(--spacing-md);
    }
  `],
})
export class EmptyStateComponent {
  /** Headline shown to the user (e.g. "Your cart is empty"). */
  readonly title = input.required<string>();
  /** Optional supporting sentence below the title. */
  readonly message = input('');
  /** Optional CTA label. With no label and no `[empty-cta]` slot, no action shows. */
  readonly ctaLabel = input('');
  /** When set, the CTA is a router link to this target; otherwise it's a button. */
  readonly ctaLink = input<string | unknown[] | null>(null);

  /** Emitted when the button-mode CTA is clicked (only when `ctaLink` is unset). */
  readonly ctaClick = output<void>();
}
