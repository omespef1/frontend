import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="chat-input-container">
      <div class="input-wrapper" [class.disabled]="disabled">
        <textarea
          class="chat-textarea"
          [(ngModel)]="question"
          [placeholder]="placeholder"
          [disabled]="disabled"
          (keydown.enter)="onEnter($event)"
          (input)="autoResize($event)"
          rows="1"
          #textarea
        ></textarea>
        <button 
          class="send-btn" 
          [disabled]="disabled || !question.trim()"
          (click)="send()">
          <app-icon name="send" size="20" color="white"></app-icon>
        </button>
      </div>
      <div class="disclaimer">
        El Agente de Comedor puede cometer errores. Verifica la información importante.
      </div>
    </div>
  `,
  styles: [`
    .chat-input-container {
      padding: 1rem 2rem;
      background-color: var(--gray-50, #FAFAFA);
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .input-wrapper {
      display: flex;
      align-items: flex-end;
      width: 100%;
      max-width: 800px;
      background-color: var(--white, #fff);
      border: 1px solid var(--gray-300, #D4D4D4);
      border-radius: 1rem;
      padding: 0.5rem;
      box-shadow: 0 2px 6px rgba(0,0,0,0.05);
      transition: border-color 0.2s;
    }
    .input-wrapper:focus-within {
      border-color: var(--kfc-red, #E4002B);
    }
    .input-wrapper.disabled {
      background-color: var(--gray-100, #F5F5F5);
    }
    .chat-textarea {
      flex: 1;
      resize: none;
      padding: 0.5rem 0.5rem;
      font-size: 1rem;
      line-height: 1.5;
      max-height: 120px;
      overflow-y: auto;
      background: transparent;
    }
    .send-btn {
      width: 40px;
      height: 40px;
      border-radius: 9999px;
      background-color: var(--kfc-red, #E4002B);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-left: 0.5rem;
      transition: opacity 0.2s;
    }
    .send-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .send-btn:hover:not(:disabled) {
      background-color: var(--kfc-red-dark, #C8001F);
    }
    .disclaimer {
      margin-top: 0.75rem;
      font-size: 0.75rem;
      color: var(--gray-500, #737373);
      text-align: center;
    }
    @media (max-width: 768px) {
      .chat-input-container {
        padding: 1rem;
      }
    }
  `]
})
export class ChatInputComponent {
  @Input() disabled = false;
  @Input() placeholder = 'Escribe tu pregunta...';
  @Output() onSubmit = new EventEmitter<string>();

  question = '';

  autoResize(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  }

  onEnter(event: any) {
    if (!event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  send() {
    if (this.question.trim() && !this.disabled) {
      this.onSubmit.emit(this.question.trim());
      this.question = '';
    }
  }
}
