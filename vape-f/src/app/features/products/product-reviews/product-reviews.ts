import { Component, ChangeDetectionStrategy, inject, signal, input, output, effect } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ReviewService } from '../services/review.service';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating';
import { ReviewResponse } from '../../../shared/models';

@Component({
  selector: 'app-product-reviews',
  imports: [ReactiveFormsModule, DatePipe, DecimalPipe, StarRatingComponent],
  templateUrl: './product-reviews.html',
  styleUrl: './product-reviews.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductReviewsComponent {
  private readonly reviewService = inject(ReviewService);
  private readonly fb = inject(FormBuilder);

  readonly productId = input.required<number>();
  readonly averageRating = input(0);
  readonly reviewCount = input(0);
  readonly reviewSubmitted = output<void>();

  readonly reviews = signal<ReviewResponse[]>([]);
  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly submitError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['']
  });

  constructor() {
    effect(() => {
      const id = this.productId();
      if (id) this.load(id);
    });
  }

  private load(productId: number): void {
    this.loading.set(true);
    this.reviewService.getForProduct(productId, 1, 50).subscribe({
      next: res => {
        this.reviews.set(res.value?.items ?? []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  setRating(value: number): void {
    this.form.controls.rating.setValue(value);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { rating, comment } = this.form.getRawValue();
    this.submitting.set(true);
    this.submitError.set(null);

    this.reviewService.create({
      productId: this.productId(),
      rating,
      comment: comment || null
    }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.form.reset({ rating: 5, comment: '' });
        this.load(this.productId());
        this.reviewSubmitted.emit();
      },
      error: (err: { error?: { message?: string } }) => {
        this.submitting.set(false);
        this.submitError.set(err.error?.message ?? 'Failed to submit review.');
      }
    });
  }
}
