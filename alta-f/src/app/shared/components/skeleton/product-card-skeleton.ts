import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SkeletonComponent } from './skeleton';

/**
 * Loading placeholder shaped like {@link ProductCardComponent}: a 4:3 image
 * area, two title lines, a price line and a button block. Render a grid of
 * these (e.g. `@for` over a fixed range) in place of the product grid while a
 * page of products is loading. Hidden from assistive tech via `app-skeleton`.
 */
@Component({
  selector: 'app-product-card-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkeletonComponent],
  template: `
    <div class="card-skeleton">
      <div class="skeleton card-skeleton__image" aria-hidden="true"></div>
      <div class="card-skeleton__body">
        <app-skeleton width="85%" />
        <app-skeleton width="55%" />
        <app-skeleton width="40%" height="1.2em" />
        <app-skeleton shape="block" height="38px" radius="var(--radius-md)" />
      </div>
    </div>
  `,
  styles: [`
    .card-skeleton {
      background: var(--color-surface);
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }

    .card-skeleton__image {
      width: 100%;
      aspect-ratio: 4 / 3;
      border-radius: 0;
    }

    .card-skeleton__body {
      padding: var(--spacing-md);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }
  `],
})
export class ProductCardSkeletonComponent {}
