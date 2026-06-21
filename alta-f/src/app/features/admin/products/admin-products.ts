import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { AdminService } from '../services/admin.service';
import { ProductService } from '../../products/services/product.service';
import { CategoryService } from '../../categories/services/category.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';
import {
  ProductResponse,
  ProductDetailsResponse,
  CategoryResponse,
  CreateProductRequest,
  UpdateProductRequest,
  ProductStatus
} from '../../../shared/models';

@Component({
  selector: 'app-admin-products',
  imports: [
    ReactiveFormsModule,
    CurrencyPipe,
    PaginationComponent,
    EmptyStateComponent,
    PageHeaderComponent,
    SkeletonComponent,
    ModalComponent,
    ConfirmDialogComponent,
  ],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminProductsComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly fb = inject(FormBuilder);

  readonly products = signal<ProductResponse[]>([]);
  readonly categories = signal<CategoryResponse[]>([]);
  readonly loading = signal(true);
  readonly loadError = signal(false);
  readonly totalPages = signal(0);
  readonly currentPage = signal(1);
  readonly actionLoadingId = signal<number | null>(null);
  readonly formLoading = signal(false);
  readonly showModal = signal(false);
  readonly editingProduct = signal<ProductResponse | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly deleteTarget = signal<ProductResponse | null>(null);

  readonly isEmpty = computed(() => !this.loading() && !this.loadError() && this.products().length === 0);

  readonly deleteMessage = computed(() => {
    const t = this.deleteTarget();
    return t ? `Delete "${t.title}"? This action cannot be undone.` : '';
  });

  readonly ProductStatus = ProductStatus;

  readonly form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    stock: [0, [Validators.required, Validators.min(0)]],
    price: [0, [Validators.required, Validators.min(0)]],
    image: ['', Validators.required],
    gallery: [''],
    categoryId: [0, [Validators.required, Validators.min(1)]],
    status: [ProductStatus.Active, Validators.required],
    discount: [0, [Validators.min(0), Validators.max(100)]]
  });

  /** Live preview of the image-URL field. */
  readonly imagePreview = toSignal(this.form.controls.image.valueChanges, { initialValue: '' });

  ngOnInit(): void {
    this.loadProducts(1);
    this.loadCategories();
  }

  loadProducts(page: number): void {
    this.loading.set(true);
    this.loadError.set(false);
    this.productService.getProducts(page, 10).subscribe({
      next: res => {
        this.products.set(res.value?.items ?? []);
        this.totalPages.set(res.value?.totalPages ?? 0);
        this.currentPage.set(page);
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set(true);
        this.loading.set(false);
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: res => this.categories.set(res.value ?? [])
    });
  }

  openCreate(): void {
    this.editingProduct.set(null);
    this.form.reset({ stock: 0, price: 0, categoryId: 0 });
    this.errorMessage.set(null);
    this.showModal.set(true);
  }

  openEdit(product: ProductResponse): void {
    this.editingProduct.set(product);
    this.errorMessage.set(null);
    // Load full details to populate all fields
    this.productService.getProductById(product.id).subscribe({
      next: res => {
        const p = res.value;
        this.form.setValue({
          title: p.title ?? '',
          description: p.description ?? '',
          stock: p.stock,
          price: p.price,
          image: p.image ?? '',
          gallery: (p.gallery ?? []).join(', '),
          categoryId: p.category?.id ?? 0,
          status: p.status ?? ProductStatus.Active,
          discount: p.discount ?? 0
        });
      }
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const gallery = v.gallery
      ? v.gallery.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : [];
    const discount = v.discount > 0 ? v.discount : null;
    const editing = this.editingProduct();
    this.formLoading.set(true);
    this.errorMessage.set(null);

    if (editing) {
      const req: UpdateProductRequest = {
        title: v.title,
        description: v.description,
        stock: v.stock,
        price: v.price,
        image: v.image,
        gallery,
        categoryId: v.categoryId,
        status: v.status,
        discount
      };
      this.adminService.updateProduct(editing.id, req).subscribe({
        next: () => {
          this.formLoading.set(false);
          this.showModal.set(false);
          this.loadProducts(this.currentPage());
        },
        error: (err: { error?: { message?: string } }) => {
          this.formLoading.set(false);
          this.errorMessage.set(err.error?.message ?? 'Failed to update product.');
        }
      });
    } else {
      const req: CreateProductRequest = {
        title: v.title,
        description: v.description,
        stock: v.stock,
        price: v.price,
        image: v.image,
        gallery,
        categoryId: v.categoryId,
        status: v.status,
        discount
      };
      this.adminService.createProduct(req).subscribe({
        next: () => {
          this.formLoading.set(false);
          this.showModal.set(false);
          this.loadProducts(1);
        },
        error: (err: { error?: { message?: string } }) => {
          this.formLoading.set(false);
          this.errorMessage.set(err.error?.message ?? 'Failed to create product.');
        }
      });
    }
  }

  requestDelete(product: ProductResponse): void {
    this.deleteTarget.set(product);
  }

  cancelDelete(): void {
    this.deleteTarget.set(null);
  }

  confirmDelete(): void {
    const target = this.deleteTarget();
    if (!target) return;
    this.actionLoadingId.set(target.id);
    this.adminService.deleteProduct(target.id).subscribe({
      next: () => {
        this.actionLoadingId.set(null);
        this.deleteTarget.set(null);
        this.products.update(list => list.filter(p => p.id !== target.id));
      },
      error: () => {
        this.actionLoadingId.set(null);
        this.deleteTarget.set(null);
      }
    });
  }

  onPageChange(page: number): void {
    this.loadProducts(page);
  }
}
