import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info';
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<ToastMessage[]>([]);
  private nextId = 0;

  show(message: string, type: 'success' | 'error' | 'info' = 'info', duration: number = 3000) {
    const id = this.nextId++;
    const toast: ToastMessage = { message, type, id };
    
    this.toasts.update(t => [...t, toast]);

    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  remove(id: number) {
    this.toasts.update(t => t.filter(toast => toast.id !== id));
  }
}
