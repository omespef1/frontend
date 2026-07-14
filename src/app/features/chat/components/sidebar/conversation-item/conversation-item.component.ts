import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Conversation } from '../../../../../core/models/conversation.model';
import { RelativeTimePipe } from '../../../../../shared/pipes/relative-time.pipe';
import { TruncatePipe } from '../../../../../shared/pipes/truncate.pipe';

@Component({
  selector: 'app-conversation-item',
  standalone: true,
  imports: [CommonModule, RelativeTimePipe, TruncatePipe],
  template: `
    <div class="conv-item" [class.active]="isActive" (click)="onClick.emit()">
      <div class="conv-content">
        <div class="conv-title">{{ conversation.title | truncate: 35 }}</div>
        <div class="conv-date">{{ conversation.updatedAt | relativeTime }}</div>
      </div>
      <button class="delete-btn" (click)="onDelete.emit(); $event.stopPropagation()">
        &times;
      </button>
    </div>
  `,
  styles: [`
    .conv-item {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      border-left: 3px solid transparent;
      cursor: pointer;
      transition: all 0.2s;
    }
    .conv-item:hover {
      background-color: var(--gray-50, #FAFAFA);
    }
    .conv-item.active {
      background-color: var(--white, #fff);
      border-left-color: var(--kfc-red, #E4002B);
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }
    .conv-content {
      flex: 1;
      min-width: 0;
    }
    .conv-title {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--gray-900, #1A1A1A);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .conv-date {
      font-size: 0.75rem;
      color: var(--gray-500, #737373);
      margin-top: 0.25rem;
    }
    .delete-btn {
      opacity: 0;
      color: var(--gray-500, #737373);
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      transition: opacity 0.2s;
      background: transparent;
      border: none;
      cursor: pointer;
    }
    .conv-item:hover .delete-btn {
      opacity: 1;
    }
    .delete-btn:hover {
      background-color: var(--gray-200, #E5E5E5);
      color: var(--gray-900, #1A1A1A);
    }
  `]
})
export class ConversationItemComponent {
  @Input() conversation!: Conversation;
  @Input() isActive = false;
  @Output() onClick = new EventEmitter<void>();
  @Output() onDelete = new EventEmitter<void>();
}
