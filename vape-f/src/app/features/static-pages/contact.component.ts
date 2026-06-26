import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  template: `
    <div class="container" style="padding: 4rem 1rem; max-width: 800px; margin: 0 auto; min-height: 60vh;">
      <h1 style="font-size: 3rem; margin-bottom: 1rem; color: var(--color-primary);">Contact Us</h1>
      <p style="font-size: 1.1rem; color: var(--color-text-muted); margin-bottom: 3rem;">
        Have a question or need support? We're here to help. Reach out to our team using the information below.
      </p>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
        <div style="padding: 2rem; background: var(--color-surface); border-radius: 12px; border: 1px solid var(--color-border); box-shadow: var(--shadow-sm);">
          <h2 style="font-size: 1.25rem; margin-bottom: 1rem; color: var(--color-text); display: flex; align-items: center; gap: 0.5rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            Phone Support
          </h2>
          <p style="color: var(--color-text-muted); line-height: 1.6;">
            <strong>Toll-Free:</strong> 1-800-VAPE-SHOP<br>
            <strong>Local:</strong> (555) 123-4567<br>
            <br>
            <em>Available Mon-Fri, 9am - 6pm EST</em>
          </p>
        </div>

        <div style="padding: 2rem; background: var(--color-surface); border-radius: 12px; border: 1px solid var(--color-border); box-shadow: var(--shadow-sm);">
          <h2 style="font-size: 1.25rem; margin-bottom: 1rem; color: var(--color-text); display: flex; align-items: center; gap: 0.5rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            Email Support
          </h2>
          <p style="color: var(--color-text-muted); line-height: 1.6;">
            <strong>General Inquiries:</strong><br>
            hello&#64;vapeshop.com<br>
            <br>
            <strong>Order Support:</strong><br>
            support&#64;vapeshop.com
          </p>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {}
