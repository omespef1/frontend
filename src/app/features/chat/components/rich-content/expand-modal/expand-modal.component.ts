import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-expand-modal',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="modal-backdrop" *ngIf="isOpen" (click)="close.emit()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="close.emit()">
          <app-icon name="x" size="24"></app-icon>
        </button>
        <div class="modal-body">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.75);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .modal-content {
      background-color: var(--white, #fff);
      border-radius: 12px;
      width: 100%;
      max-width: 1000px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      position: relative;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
    .close-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: transparent;
      border: none;
      color: var(--gray-500, #737373);
      cursor: pointer;
      z-index: 10;
      padding: 0.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .close-btn:hover {
      background-color: var(--gray-100, #F5F5F5);
      color: var(--gray-900, #1A1A1A);
    }
    .modal-body {
      padding: 2rem;
      overflow-y: auto;
      flex: 1;
    }
    ::ng-deep .modal-body .chart-container {
      border: none;
      margin: 0;
    }
    ::ng-deep .modal-body .echarts-wrapper {
      height: 600px !important;
    }
  `]
})
export class ExpandModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
}
