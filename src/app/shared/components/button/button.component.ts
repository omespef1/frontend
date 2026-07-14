import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="btn" 
      [ngClass]="[variantClass, sizeClass, class]" 
      [disabled]="disabled"
      (click)="onClick.emit($event)">
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.2s ease;
      font-family: inherit;
      cursor: pointer;
      border: 1px solid transparent;
    }
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    /* Variants */
    .btn-primary {
      background-color: #E4002B;
      color: white;
    }
    .btn-primary:hover:not(:disabled) {
      background-color: #C8001F;
    }
    .btn-outline {
      background-color: transparent;
      border-color: #D4D4D4;
      color: #1A1A1A;
    }
    .btn-outline:hover:not(:disabled) {
      background-color: #F5F5F5;
      border-color: #737373;
    }
    .btn-ghost {
      background-color: transparent;
      color: #1A1A1A;
    }
    .btn-ghost:hover:not(:disabled) {
      background-color: #F5F5F5;
    }
    
    /* Sizes */
    .btn-sm {
      padding: 0.375rem 0.75rem;
      font-size: 0.875rem;
    }
    .btn-md {
      padding: 0.5rem 1rem;
      font-size: 1rem;
    }
    .btn-icon {
      padding: 0.5rem;
      border-radius: 9999px;
    }
  `]
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'outline' | 'ghost' = 'primary';
  @Input() size: 'sm' | 'md' | 'icon' = 'md';
  @Input() disabled = false;
  @Input() class = '';
  @Output() onClick = new EventEmitter<MouseEvent>();
  
  get variantClass() { return `btn-${this.variant}`; }
  get sizeClass() { return `btn-${this.size}`; }
}
