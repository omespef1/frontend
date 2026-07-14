import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../../../../../core/models/message.model';
import { AvatarComponent } from '../../../../../shared/components/avatar/avatar.component';
import { SourceChipsComponent } from '../source-chips/source-chips.component';
import { MarkdownComponent } from 'ngx-markdown';
import { RichContentComponent } from '../../rich-content/rich-content.component';

@Component({
  selector: 'app-message-bubble',
  standalone: true,
  imports: [CommonModule, AvatarComponent, SourceChipsComponent, MarkdownComponent, RichContentComponent],
  template: `
    <div class="message-wrapper" [class.is-user]="isUser">
      <div class="avatar-container">
        <app-avatar 
          *ngIf="isUser" 
          [name]="userName" 
          bgColor="red" 
          size="md">
        </app-avatar>
        
        <div class="agent-avatar" *ngIf="!isUser">
          <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="8" fill="#E4002B"/>
            <path d="M12 28V12H16.5C18.5 12 20 12.5 21 13.5C22 14.5 22.5 16 22.5 18C22.5 20 22 21.5 21 22.5C20 23.5 18.5 24 16.5 24H15V28H12ZM15 21H16.5C17.5 21 18.25 20.75 18.75 20.25C19.25 19.75 19.5 19 19.5 18C19.5 17 19.25 16.25 18.75 15.75C18.25 15.25 17.5 15 16.5 15H15V21Z" fill="white"/>
          </svg>
        </div>
      </div>
      
      <div class="message-content">
        <div class="message-header">
          <span class="sender-name">{{ isUser ? userName : 'Agente de Comedor' }}</span>
          <span class="timestamp">{{ message.timestamp | date:'shortTime' }}</span>
        </div>
        
        <div class="message-body">
          <markdown [data]="message.content"></markdown>
        </div>
        
        <app-rich-content [blocks]="message.richContent"></app-rich-content>

        <app-source-chips [sources]="message.sources"></app-source-chips>
      </div>
    </div>
  `,
  styles: [`
    .message-wrapper {
      display: flex;
      gap: 1rem;
      max-width: 800px;
      margin: 0 auto;
      padding: 1.5rem 2rem;
      border-radius: 12px;
    }
    .message-wrapper:hover {
      background-color: var(--gray-50, #FAFAFA);
    }
    .avatar-container {
      flex-shrink: 0;
    }
    .agent-avatar {
      width: 40px;
      height: 40px;
      border-radius: 9999px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .agent-avatar svg {
      width: 100%;
      height: 100%;
    }
    .message-content {
      flex: 1;
      min-width: 0;
    }
    .message-header {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }
    .sender-name {
      font-weight: 600;
      color: var(--gray-900, #1A1A1A);
    }
    .timestamp {
      font-size: 0.75rem;
      color: var(--gray-500, #737373);
    }
    .message-body {
      color: var(--gray-800, #262626);
      line-height: 1.6;
      font-size: 0.9375rem;
    }
    ::ng-deep .message-body p { margin-bottom: 0.75rem; }
    ::ng-deep .message-body p:last-child { margin-bottom: 0; }
    ::ng-deep .message-body ul, ::ng-deep .message-body ol { margin-bottom: 0.75rem; padding-left: 1.5rem; }
    ::ng-deep .message-body strong { font-weight: 600; }
    ::ng-deep .message-body code { background-color: var(--gray-100, #F5F5F5); padding: 0.125rem 0.25rem; border-radius: 4px; font-family: monospace; font-size: 0.875em;}
    ::ng-deep .message-body pre { background-color: var(--gray-100, #F5F5F5); padding: 1rem; border-radius: 8px; overflow-x: auto; margin-bottom: 0.75rem;}
    
    @media (max-width: 768px) {
      .message-wrapper {
        padding: 1rem;
      }
    }
  `]
})
export class MessageBubbleComponent {
  @Input() message!: Message;
  @Input() userName = 'Usuario';
  
  get isUser(): boolean {
    return this.message.role === 'user';
  }
}
