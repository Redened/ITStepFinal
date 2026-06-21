import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AddressService } from '../services/address.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { AddressResponse } from '../../../shared/models';

@Component({
  selector: 'app-address-book',
  imports: [ReactiveFormsModule, ConfirmDialogComponent],
  templateUrl: './address-book.html',
  styleUrl: './address-book.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressBookComponent implements OnInit {
  private readonly addressService = inject(AddressService);
  private readonly fb = inject(FormBuilder);

  readonly addresses = signal<AddressResponse[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly showForm = signal(false);
  readonly editingId = signal<number | null>(null);
  readonly saving = signal(false);
  readonly deleteId = signal<number | null>(null);
  readonly deleting = signal(false);

  /** Label of the address pending deletion, for the confirm dialog message. */
  readonly deleteTarget = computed(() =>
    this.addresses().find(a => a.id === this.deleteId())?.title ?? null
  );

  readonly form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    fullName: ['', Validators.required],
    line: ['', Validators.required],
    city: ['', Validators.required],
    postalCode: [''],
    isDefault: [false]
  });

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.addressService.getAddresses().subscribe({
      next: res => {
        this.addresses.set(res.value ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Failed to load addresses.');
      }
    });
  }

  openCreate(): void {
    this.editingId.set(null);
    this.form.reset({ isDefault: this.addresses().length === 0 });
    this.showForm.set(true);
  }

  openEdit(address: AddressResponse): void {
    this.editingId.set(address.id);
    this.form.setValue({
      title: address.title,
      fullName: address.fullName,
      line: address.line,
      city: address.city,
      postalCode: address.postalCode ?? '',
      isDefault: address.isDefault
    });
    this.showForm.set(true);
  }

  cancel(): void {
    this.showForm.set(false);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const req = {
      title: v.title,
      fullName: v.fullName,
      line: v.line,
      city: v.city,
      postalCode: v.postalCode || null,
      isDefault: v.isDefault
    };
    this.saving.set(true);
    const id = this.editingId();
    const call = id != null
      ? this.addressService.update(id, req)
      : this.addressService.create(req);

    call.subscribe({
      next: () => {
        this.saving.set(false);
        this.showForm.set(false);
        this.load();
      },
      error: () => this.saving.set(false)
    });
  }

  requestDelete(addressId: number): void {
    this.deleteId.set(addressId);
  }

  cancelDelete(): void {
    if (this.deleting()) return;
    this.deleteId.set(null);
  }

  confirmDelete(): void {
    const id = this.deleteId();
    if (id == null) return;
    this.deleting.set(true);
    this.addressService.delete(id).subscribe({
      next: () => {
        this.addresses.update(list => list.filter(a => a.id !== id));
        this.deleting.set(false);
        this.deleteId.set(null);
      },
      error: () => {
        this.deleting.set(false);
        this.deleteId.set(null);
      }
    });
  }
}
