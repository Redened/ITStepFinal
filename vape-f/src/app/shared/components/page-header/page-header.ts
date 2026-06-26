import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** A single breadcrumb entry; the last entry renders as the current page. */
export interface Breadcrumb {
  label: string;
  /** Router link target. Omit (or leave on the last crumb) for a non-link. */
  link?: string | unknown[];
}

/**
 * Consistent admin page header: an optional breadcrumb trail, a title with an
 * optional subtitle, and a right-aligned actions row.
 *
 * Use the `title` input (or project `[page-title]` for full control) and
 * project action buttons into the `[page-actions]` slot. The actions row hides
 * itself when nothing is projected. Adopted by all admin pages in Phase E.
 */
@Component({
  selector: 'app-page-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <header class="page-header">
      @if (breadcrumbs().length) {
        <nav class="page-header__breadcrumb" aria-label="Breadcrumb">
          <ol>
            @for (crumb of breadcrumbs(); track $index; let last = $last) {
              <li>
                @if (crumb.link && !last) {
                  <a [routerLink]="crumb.link">{{ crumb.label }}</a>
                } @else {
                  <span [attr.aria-current]="last ? 'page' : null">{{ crumb.label }}</span>
                }
              </li>
            }
          </ol>
        </nav>
      }

      <div class="page-header__row">
        <div class="page-header__heading">
          @if (title()) {
            <h1 class="page-header__title">{{ title() }}</h1>
          } @else {
            <ng-content select="[page-title]" />
          }
          @if (subtitle()) {
            <p class="page-header__subtitle">{{ subtitle() }}</p>
          }
        </div>

        <div class="page-header__actions">
          <ng-content select="[page-actions]" />
        </div>
      </div>
    </header>
  `,
  styles: [`
    .page-header {
      margin-bottom: var(--spacing-lg);
    }

    .page-header__breadcrumb ol {
      list-style: none;
      margin: 0 0 var(--spacing-xs);
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--spacing-xs);
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
    }

    .page-header__breadcrumb li:not(:last-child)::after {
      content: '/';
      margin-left: var(--spacing-xs);
      color: var(--color-border);
    }

    .page-header__breadcrumb a {
      color: var(--color-text-muted);
      text-decoration: none;

      &:hover { color: var(--color-accent); }
    }

    .page-header__row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-md);
      flex-wrap: wrap;
    }

    .page-header__title {
      font-size: var(--font-size-xl);
      font-weight: 700;
      margin: 0;
      color: var(--color-text);
    }

    .page-header__subtitle {
      margin: var(--spacing-2xs) 0 0;
      color: var(--color-text-muted);
      font-size: var(--font-size-sm);
    }

    .page-header__actions {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      flex-wrap: wrap;

      &:empty { display: none; }
    }
  `],
})
export class PageHeaderComponent {
  /** Page title (alternative to projecting `[page-title]`). */
  readonly title = input('');
  /** Optional supporting line below the title. */
  readonly subtitle = input('');
  /** Optional breadcrumb trail; the last entry is the current page. */
  readonly breadcrumbs = input<Breadcrumb[]>([]);
}
