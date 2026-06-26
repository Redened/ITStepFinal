import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { AdminService } from '../services/admin.service';
import { CategoryService } from '../../categories/services/category.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { CategoryResponse, CreateCategoryRequest, UpdateCategoryRequest } from '../../../shared/models';

/** A category flattened into display order with its nesting depth. */
interface OrderedCategory extends CategoryResponse {
  depth: number;
}

@Component({
  selector: 'app-admin-categories',
  imports: [
    ReactiveFormsModule,
    EmptyStateComponent,
    PageHeaderComponent,
    SkeletonComponent,
    ModalComponent,
    ConfirmDialogComponent,
  ],
  templateUrl: './admin-categories.html',
  styleUrl: './admin-categories.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminCategoriesComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly categoryService = inject(CategoryService);
  private readonly fb = inject(FormBuilder);

  readonly categories = signal<CategoryResponse[]>([]);
  readonly loading = signal(true);
  readonly loadError = signal(false);
  readonly actionLoadingId = signal<number | null>(null);
  readonly formLoading = signal(false);
  readonly showModal = signal(false);
  readonly editingCategory = signal<CategoryResponse | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly deleteTarget = signal<CategoryResponse | null>(null);

  readonly isEmpty = computed(() => !this.loading() && !this.loadError() && this.categories().length === 0);

  readonly deleteMessage = computed(() => {
    const t = this.deleteTarget();
    return t ? `Delete the "${t.name}" category? This action cannot be undone.` : '';
  });

  // Categories flattened parent-first so children render indented under them.
  readonly orderedCategories = computed<OrderedCategory[]>(() => {
    const all = this.categories();
    const byParent = new Map<number | null, CategoryResponse[]>();
    for (const c of all) {
      const key = c.parentId ?? null;
      byParent.set(key, [...(byParent.get(key) ?? []), c]);
    }
    const result: OrderedCategory[] = [];
    const visit = (parentId: number | null, depth: number) => {
      for (const c of byParent.get(parentId) ?? []) {
        result.push({ ...c, depth });
        visit(c.id, depth + 1);
      }
    };
    visit(null, 0);
    // Include any orphans whose parent isn't in the current list.
    if (result.length < all.length) {
      const seen = new Set(result.map(r => r.id));
      for (const c of all) {
        if (!seen.has(c.id)) result.push({ ...c, depth: 0 });
      }
    }
    return result;
  });

  // Possible parents = all categories except the one being edited.
  readonly parentOptions = computed(() => {
    const editingId = this.editingCategory()?.id;
    return this.categories().filter(c => c.id !== editingId);
  });

  // 0 in the parentId control means "no parent" (top-level category).
  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    imageUrl: ['', Validators.required],
    description: [''],
    parentId: [0]
  });

  /** Live preview of the image-URL field. */
  readonly imagePreview = toSignal(this.form.controls.imageUrl.valueChanges, { initialValue: '' });

  categoryName(id: number | null): string {
    if (id == null) return '—';
    return this.categories().find(c => c.id === id)?.name ?? '—';
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading.set(true);
    this.loadError.set(false);
    this.categoryService.getCategories().subscribe({
      next: res => {
        this.categories.set(res.value ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set(true);
        this.loading.set(false);
      }
    });
  }

  openCreate(): void {
    this.editingCategory.set(null);
    this.form.reset();
    this.errorMessage.set(null);
    this.showModal.set(true);
  }

  openEdit(category: CategoryResponse): void {
    this.editingCategory.set(category);
    this.form.setValue({
      name: category.name ?? '',
      imageUrl: category.imageUrl ?? '',
      description: category.description ?? '',
      parentId: category.parentId ?? 0
    });
    this.errorMessage.set(null);
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
    const editing = this.editingCategory();
    const parentId = v.parentId ? Number(v.parentId) : null;
    const description = v.description ? v.description : null;
    this.formLoading.set(true);
    this.errorMessage.set(null);

    if (editing) {
      const req: UpdateCategoryRequest = { name: v.name, imageUrl: v.imageUrl, description, parentId };
      this.adminService.updateCategory(editing.id, req).subscribe({
        next: () => {
          this.formLoading.set(false);
          this.showModal.set(false);
          this.loadCategories();
        },
        error: (err: { error?: { message?: string } }) => {
          this.formLoading.set(false);
          this.errorMessage.set(err.error?.message ?? 'Failed to update category.');
        }
      });
    } else {
      const req: CreateCategoryRequest = { name: v.name, imageUrl: v.imageUrl, description, parentId };
      this.adminService.createCategory(req).subscribe({
        next: () => {
          this.formLoading.set(false);
          this.showModal.set(false);
          this.loadCategories();
        },
        error: (err: { error?: { message?: string } }) => {
          this.formLoading.set(false);
          this.errorMessage.set(err.error?.message ?? 'Failed to create category.');
        }
      });
    }
  }

  requestDelete(category: CategoryResponse): void {
    this.deleteTarget.set(category);
  }

  cancelDelete(): void {
    this.deleteTarget.set(null);
  }

  confirmDelete(): void {
    const target = this.deleteTarget();
    if (!target) return;
    this.actionLoadingId.set(target.id);
    this.adminService.deleteCategory(target.id).subscribe({
      next: () => {
        this.actionLoadingId.set(null);
        this.deleteTarget.set(null);
        this.categories.update(list => list.filter(c => c.id !== target.id));
      },
      error: () => {
        this.actionLoadingId.set(null);
        this.deleteTarget.set(null);
      }
    });
  }
}
