import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit, DestroyRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DOCUMENT } from '@angular/common';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../../categories/services/category.service';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { ProductCardSkeletonComponent } from '../../../shared/components/skeleton/product-card-skeleton';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { ProductResponse, CategoryResponse } from '../../../shared/models';

type FilterKey = 'Query' | 'CategoryId' | 'MinPrice' | 'MaxPrice';
interface FilterChip {
  key: FilterKey;
  label: string;
}

@Component({
  selector: 'app-product-list',
  imports: [
    ReactiveFormsModule,
    ProductCardComponent,
    PaginationComponent,
    ProductCardSkeletonComponent,
    EmptyStateComponent
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);

  readonly products = signal<ProductResponse[]>([]);
  readonly categories = signal<CategoryResponse[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly totalPages = signal(0);
  readonly totalCount = signal(0);
  readonly currentPage = signal(1);
  readonly sidebarOpen = signal(false);

  /** Placeholder cards shown while a page of products is loading. */
  readonly skeletons = Array.from({ length: 8 });

  readonly filterForm = this.fb.group({
    Query: [''],
    CategoryId: [null as number | null],
    MinPrice: [null as number | null],
    MaxPrice: [null as number | null]
  });

  /** Live mirror of the form value, used to derive the active filter chips. */
  private readonly filterSnapshot = signal(this.filterForm.getRawValue());

  /** One chip per active filter, e.g. for an "active filters" row with remove buttons. */
  readonly activeChips = computed<FilterChip[]>(() => {
    const v = this.filterSnapshot();
    const chips: FilterChip[] = [];
    if (v.Query) chips.push({ key: 'Query', label: `“${v.Query}”` });
    if (v.CategoryId != null) {
      const name = this.categories().find(c => c.id === v.CategoryId)?.name;
      chips.push({ key: 'CategoryId', label: name ?? 'Category' });
    }
    if (v.MinPrice != null) chips.push({ key: 'MinPrice', label: `Min $${v.MinPrice}` });
    if (v.MaxPrice != null) chips.push({ key: 'MaxPrice', label: `Max $${v.MaxPrice}` });
    return chips;
  });

  readonly hasActiveFilters = computed(() => this.activeChips().length > 0);

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts(1);

    // Keep the chip snapshot in step with user input (no debounce, so chips
    // appear/update instantly even though the reloads below are debounced).
    this.filterForm.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.filterSnapshot.set(this.filterForm.getRawValue()));

    this.filterForm.controls.Query.valueChanges.pipe(
      debounceTime(450),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.loadProducts(1));

    this.filterForm.controls.CategoryId.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.loadProducts(1));

    this.filterForm.controls.MinPrice.valueChanges.pipe(
      debounceTime(450),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.loadProducts(1));

    this.filterForm.controls.MaxPrice.valueChanges.pipe(
      debounceTime(450),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.loadProducts(1));
  }

  private loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: res => this.categories.set(res.value ?? []),
      error: () => {}
    });
  }

  loadProducts(page: number): void {
    const { Query, CategoryId, MinPrice, MaxPrice } = this.filterForm.getRawValue();
    const hasFilters = !!Query || !!CategoryId || MinPrice != null || MaxPrice != null;

    this.loading.set(true);
    this.error.set(null);

    const call = hasFilters
      ? this.productService.filterProducts({
          Query: Query || undefined,
          CategoryId: CategoryId ?? undefined,
          MinPrice: MinPrice ?? undefined,
          MaxPrice: MaxPrice ?? undefined,
          Page: page,
          Take: 12
        })
      : this.productService.getProducts(page, 12);

    call.subscribe({
      next: res => {
        this.products.set(res.value?.items ?? []);
        this.totalPages.set(res.value?.totalPages ?? 0);
        this.totalCount.set(res.value?.totalCount ?? 0);
        this.currentPage.set(page);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Failed to load products. Please try again.');
      }
    });
  }

  onPageChange(page: number): void {
    this.loadProducts(page);
    this.document.defaultView?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  clearFilters(): void {
    this.filterForm.reset(
      { Query: '', CategoryId: null, MinPrice: null, MaxPrice: null },
      { emitEvent: false }
    );
    this.filterSnapshot.set(this.filterForm.getRawValue());
    this.loadProducts(1);
  }

  /** Clear a single filter from the active-chips row. */
  removeFilter(key: FilterKey): void {
    if (key === 'Query') {
      this.filterForm.controls.Query.setValue('', { emitEvent: false });
    } else {
      this.filterForm.controls[key].setValue(null, { emitEvent: false });
    }
    this.filterSnapshot.set(this.filterForm.getRawValue());
    this.loadProducts(1);
  }

  toggleSidebar(): void {
    this.sidebarOpen.update(open => !open);
  }
}
