import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  /** How long (ms) the toast stays before auto-dismiss; drives the progress bar. */
  duration: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly _notifications = signal<Notification[]>([]);
  readonly notifications = this._notifications.asReadonly();
  private nextId = 0;

  error(message: string, duration = 6000): void {
    this.add('error', message, duration);
  }

  success(message: string, duration = 4000): void {
    this.add('success', message, duration);
  }

  warning(message: string, duration = 5000): void {
    this.add('warning', message, duration);
  }

  info(message: string, duration = 4000): void {
    this.add('info', message, duration);
  }

  remove(id: number): void {
    this._notifications.update(list => list.filter(n => n.id !== id));
  }

  private add(type: NotificationType, message: string, duration: number): void {
    const id = ++this.nextId;
    this._notifications.update(list => [...list, { id, type, message, duration }]);
    setTimeout(() => this.remove(id), duration);
  }
}
