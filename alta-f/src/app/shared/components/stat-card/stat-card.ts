import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';

type StatVariant = 'default' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
type TrendDirection = 'up' | 'down' | 'neutral';

/**
 * Reusable dashboard stat tile: a big value, a label, an optional projected
 * icon and an optional trend indicator. `variant` tints the left accent /
 * border for emphasis (e.g. `warning` for low stock). Adopted by E1.
 *
 * Project an icon into the `[stat-icon]` slot.
 */
@Component({
  selector: 'app-stat-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stat-card" [class]="variantClass()">
      <div class="stat-card__top">
        <span class="stat-card__label">{{ label() }}</span>
        <span class="stat-card__icon" aria-hidden="true">
          <ng-content select="[stat-icon]" />
        </span>
      </div>

      <span class="stat-card__value">{{ value() }}</span>

      @if (trend()) {
        <span class="stat-card__trend" [class]="trendClass()">
          <span aria-hidden="true">{{ trendArrow() }}</span> {{ trend() }}
        </span>
      }
    </div>
  `,
  styles: [`
    .stat-card {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2xs);
      padding: var(--spacing-lg);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-left: 3px solid var(--color-border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
    }

    .stat-card__top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-sm);
    }

    .stat-card__label {
      color: var(--color-text-muted);
      font-size: var(--font-size-sm);
    }

    .stat-card__icon {
      display: inline-flex;
      align-items: center;
      color: var(--color-text-muted);
      font-size: var(--font-size-lg);

      &:empty { display: none; }
    }

    .stat-card__value {
      font-size: var(--font-size-2xl);
      font-weight: 700;
      color: var(--color-text);
      line-height: 1.1;
    }

    .stat-card__trend {
      font-size: var(--font-size-xs);
      font-weight: 600;
      color: var(--color-text-muted);
    }
    .stat-card__trend--up { color: var(--color-success); }
    .stat-card__trend--down { color: var(--color-danger); }

    .stat-card--accent  { border-left-color: var(--color-accent); }
    .stat-card--success { border-left-color: var(--color-success); }
    .stat-card--warning { border-left-color: var(--color-warning); }
    .stat-card--danger  { border-left-color: var(--color-danger); }
    .stat-card--info    { border-left-color: var(--color-info); }
  `],
})
export class StatCardComponent {
  /** Caption describing the metric. */
  readonly label = input.required<string>();
  /** The metric value (pre-formatted by the caller, e.g. via a pipe). */
  readonly value = input.required<string | number>();
  /** Emphasis colour for the left accent. */
  readonly variant = input<StatVariant>('default');
  /** Optional trend text, e.g. "+12% vs last week". */
  readonly trend = input('');
  /** Trend direction — drives colour and arrow. */
  readonly trendDirection = input<TrendDirection>('neutral');

  protected readonly variantClass = computed(() =>
    this.variant() === 'default' ? '' : `stat-card--${this.variant()}`
  );
  protected readonly trendClass = computed(() => `stat-card__trend--${this.trendDirection()}`);
  protected readonly trendArrow = computed(() => {
    switch (this.trendDirection()) {
      case 'up': return '↑';
      case 'down': return '↓';
      default: return '→';
    }
  });
}
