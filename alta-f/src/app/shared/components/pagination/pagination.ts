import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';

@Component({
  selector: 'app-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (totalPages() > 1) {
      <nav class="pagination" aria-label="Pagination navigation">
        <button
          class="pagination__btn"
          [disabled]="currentPage() === 1"
          (click)="goTo(currentPage() - 1)"
          aria-label="Previous page"
        >&#8249;</button>

        @for (page of visiblePages(); track $index) {
          @if (page === 0) {
            <span class="pagination__ellipsis" aria-hidden="true">&#8230;</span>
          } @else {
            <button
              class="pagination__btn"
              [class.pagination__btn--active]="page === currentPage()"
              [attr.aria-current]="page === currentPage() ? 'page' : null"
              [attr.aria-label]="'Page ' + page"
              (click)="goTo(page)"
            >{{ page }}</button>
          }
        }

        <button
          class="pagination__btn"
          [disabled]="currentPage() === totalPages()"
          (click)="goTo(currentPage() + 1)"
          aria-label="Next page"
        >&#8250;</button>
      </nav>
    }
  `,
  styles: [`
    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      flex-wrap: wrap;
    }
    .pagination__btn {
      min-width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      border: 1.5px solid var(--color-border);
      background: var(--color-surface);
      color: var(--color-text);
      font-size: var(--font-size-sm);
      font-weight: 500;
      cursor: pointer;
      transition: background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0 8px;
    }
    .pagination__btn:hover:not(:disabled) {
      background: var(--color-accent);
      color: #fff;
      border-color: var(--color-accent);
    }
    .pagination__btn:focus-visible {
      outline: 2px solid var(--color-accent);
      outline-offset: 2px;
    }
    .pagination__btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .pagination__btn--active {
      background: var(--color-accent);
      color: #fff;
      border-color: var(--color-accent);
    }
    .pagination__ellipsis {
      padding: 0 6px;
      color: var(--color-text-muted);
      font-size: var(--font-size-sm);
    }
  `]
})
export class PaginationComponent {
  readonly currentPage = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly pageChange = output<number>();

  readonly visiblePages = computed((): number[] => {
    const total = this.totalPages();
    const current = this.currentPage();

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: number[] = [1];
    if (current > 3) pages.push(0);
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i);
    }
    if (current < total - 2) pages.push(0);
    pages.push(total);
    return pages;
  });

  goTo(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.pageChange.emit(page);
    }
  }
}
