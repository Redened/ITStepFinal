import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';

type SkeletonShape = 'line' | 'block' | 'card' | 'circle';

interface ShapeDefaults {
  width: string;
  height: string;
  radius: string;
}

const SHAPE_DEFAULTS: Record<SkeletonShape, ShapeDefaults> = {
  line: { width: '100%', height: '0.85em', radius: 'var(--radius-sm)' },
  block: { width: '100%', height: '120px', radius: 'var(--radius-md)' },
  card: { width: '100%', height: '200px', radius: 'var(--radius-lg)' },
  circle: { width: '40px', height: '40px', radius: '50%' },
};

/**
 * A single shimmering placeholder, used while content loads. Reuses the global
 * `.skeleton` shimmer utility from `styles.scss`.
 *
 * Pick a `shape` (line/block/card/circle) for sensible defaults, then override
 * `width` / `height` / `radius` as needed. The element is hidden from assistive
 * tech; wrap groups of skeletons in a container with `aria-busy="true"`.
 */
@Component({
  selector: 'app-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  host: {
    class: 'skeleton',
    'aria-hidden': 'true',
    '[style.display]': '"block"',
    '[style.width]': 'resolvedWidth()',
    '[style.height]': 'resolvedHeight()',
    '[style.borderRadius]': 'resolvedRadius()',
  },
})
export class SkeletonComponent {
  /** Preset shape that drives the default dimensions. */
  readonly shape = input<SkeletonShape>('line');
  /** Optional explicit width (any CSS length); overrides the shape default. */
  readonly width = input('');
  /** Optional explicit height (any CSS length); overrides the shape default. */
  readonly height = input('');
  /** Optional explicit border-radius; overrides the shape default. */
  readonly radius = input('');

  protected readonly resolvedWidth = computed(() => this.width() || SHAPE_DEFAULTS[this.shape()].width);
  protected readonly resolvedHeight = computed(() => this.height() || SHAPE_DEFAULTS[this.shape()].height);
  protected readonly resolvedRadius = computed(() => this.radius() || SHAPE_DEFAULTS[this.shape()].radius);
}
