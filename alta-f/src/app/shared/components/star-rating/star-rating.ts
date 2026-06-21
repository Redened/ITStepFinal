import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  computed,
  inject,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';

type StarFill = 'full' | 'half' | 'empty';
type StarSize = 'sm' | 'md' | 'lg';

/**
 * One star-rating widget for both display and input.
 *
 * - **Display** (`readonly`, the default): renders the average `value` as an
 *   `img` with an accessible label; set `allowHalf` for half-star precision.
 * - **Input** (`readonly="false"`): an accessible `radiogroup` of 1..`max`
 *   stars with roving-tabindex keyboard navigation (←/→/↑/↓, Home/End,
 *   Space/Enter) and hover preview. Use `[(value)]` or `value`/`valueChange`.
 *
 * Replaces the bespoke `<select>` rating in the review form and the inline
 * stars on the product card / detail header.
 */
@Component({
  selector: 'app-star-rating',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (readonly()) {
      <div class="stars" [class]="sizeClass()" role="img" [attr.aria-label]="displayLabel()">
        @for (star of stars(); track star) {
          <span
            class="stars__star"
            [class.stars__star--full]="fillOf(star) === 'full'"
            [class.stars__star--half]="fillOf(star) === 'half'"
            aria-hidden="true"
          >&#9733;</span>
        }
      </div>
    } @else {
      <div
        class="stars stars--input"
        [class]="sizeClass()"
        role="radiogroup"
        [attr.aria-label]="label()"
        (keydown)="onKeydown($event)"
        (mouseleave)="hover.set(null)"
      >
        @for (star of stars(); track star) {
          <button
            type="button"
            role="radio"
            class="stars__star stars__star--button"
            [class.stars__star--full]="displayValue() >= star"
            [attr.aria-checked]="selected() === star"
            [attr.aria-label]="star + (star === 1 ? ' star' : ' stars')"
            [attr.tabindex]="rovingIndex(star)"
            (click)="select(star)"
            (mouseenter)="hover.set(star)"
            (focus)="focused.set(star)"
          >&#9733;</button>
        }
      </div>
    }
  `,
  styles: [`
    .stars {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      font-size: var(--font-size-base);
      line-height: 1;
    }
    .stars--sm { font-size: var(--font-size-sm); }
    .stars--lg { font-size: var(--font-size-xl); }

    .stars__star {
      color: var(--color-border);
      position: relative;
    }

    .stars__star--full {
      color: var(--color-warning);
    }

    /* Half star: overlay a clipped filled star on top of the empty one. */
    .stars__star--half {
      color: var(--color-border);
    }
    .stars__star--half::before {
      content: '\\2605';
      position: absolute;
      inset: 0;
      width: 50%;
      overflow: hidden;
      color: var(--color-warning);
    }

    .stars__star--button {
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      font-size: inherit;
      line-height: 1;
      transition: color var(--transition-fast) ease, transform var(--transition-fast) ease;
    }
    .stars__star--button:hover {
      transform: scale(1.1);
    }
    .stars__star--button:focus-visible {
      outline: 2px solid var(--color-accent);
      outline-offset: 2px;
      border-radius: var(--radius-sm);
    }

    @media (prefers-reduced-motion: reduce) {
      .stars__star--button {
        transition: none;
      }
      .stars__star--button:hover {
        transform: none;
      }
    }
  `],
})
export class StarRatingComponent {
  /** Current rating value (average for display, selection for input). */
  readonly value = input(0);
  /** Display mode (`true`) vs interactive input mode (`false`). */
  readonly readonly = input(true);
  /** Number of stars. */
  readonly max = input(5);
  /** Allow half-star precision in display mode. */
  readonly allowHalf = input(false);
  /** Visual size. */
  readonly size = input<StarSize>('md');
  /** Accessible label for the input radiogroup. */
  readonly label = input('Rating');

  /** Emitted in input mode when the user picks a rating. */
  readonly valueChange = output<number>();

  /** Local selection that tracks `value` but can be set on interaction. */
  protected readonly selected = linkedSignal(() => this.value());
  protected readonly hover = signal<number | null>(null);
  protected readonly focused = signal<number | null>(null);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly stars = computed(() => Array.from({ length: this.max() }, (_, i) => i + 1));
  protected readonly sizeClass = computed(() => `stars--${this.size()}`);
  /** Value shown in input mode (hover preview wins over the selection). */
  protected readonly displayValue = computed(() => this.hover() ?? this.selected());

  protected readonly displayLabel = computed(() => {
    const v = Math.round(this.value() * 10) / 10;
    return `Rated ${v} out of ${this.max()}`;
  });

  protected fillOf(star: number): StarFill {
    const v = this.value();
    if (v >= star) return 'full';
    if (this.allowHalf() && v >= star - 0.5) return 'half';
    return 'empty';
  }

  /** Roving tabindex: only the selected star (or the first) is tabbable. */
  protected rovingIndex(star: number): number {
    const active = this.selected() || 1;
    return star === active ? 0 : -1;
  }

  protected select(star: number): void {
    this.selected.set(star);
    this.valueChange.emit(star);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const current = this.selected() || 1;
    let next: number | null = null;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = Math.min(this.max(), current + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        next = Math.max(1, current - 1);
        break;
      case 'Home':
        next = 1;
        break;
      case 'End':
        next = this.max();
        break;
      case ' ':
      case 'Enter':
        next = current;
        break;
      default:
        return;
    }

    event.preventDefault();
    this.select(next);
    this.focusStar(next);
  }

  private focusStar(star: number): void {
    const buttons = this.host.nativeElement.querySelectorAll<HTMLButtonElement>('button');
    buttons[star - 1]?.focus();
  }
}
