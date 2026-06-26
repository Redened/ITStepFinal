import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <div class="container" style="padding: 4rem 1rem; max-width: 800px; margin: 0 auto; min-height: 60vh;">
      <h1 style="font-size: 3rem; margin-bottom: 2rem; color: var(--color-primary);">About VAPE Shop</h1>
      <p style="font-size: 1.1rem; line-height: 1.8; color: var(--color-text); margin-bottom: 1.5rem;">
        Welcome to VAPE Shop, your premium destination for high-quality vaping products and accessories. 
        Founded with a passion for excellence, our mission is to provide an unparalleled shopping experience 
        and deliver only the best products the industry has to offer.
      </p>
      <p style="font-size: 1.1rem; line-height: 1.8; color: var(--color-text); margin-bottom: 1.5rem;">
        We carefully curate our inventory to ensure every item meets our strict quality standards. 
        Whether you are a beginner looking for your first starter kit, or an enthusiast searching for 
        advanced mods and premium e-liquids, we have something for everyone.
      </p>
      <div style="margin-top: 3rem; padding: 2rem; background: var(--color-surface); border-radius: 12px; box-shadow: var(--shadow-sm); border: 1px solid var(--color-border);">
        <h2 style="font-size: 1.5rem; margin-bottom: 1rem; color: var(--color-accent);">Our Commitment</h2>
        <ul style="list-style: disc; padding-left: 1.5rem; line-height: 1.8; color: var(--color-text-muted);">
          <li>100% Authentic Products</li>
          <li>Fast and Reliable Shipping</li>
          <li>Exceptional Customer Support</li>
          <li>Secure Shopping Experience</li>
        </ul>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {}
