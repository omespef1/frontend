import { Component, ElementRef, Input, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../../../../../core/models/message.model';
import { MessageBubbleComponent } from '../message-bubble/message-bubble.component';
import { TypingIndicatorComponent } from '../typing-indicator/typing-indicator.component';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [CommonModule, MessageBubbleComponent, TypingIndicatorComponent],
  template: `
    <div class="message-list-container" #scrollContainer>
      <app-message-bubble 
        *ngFor="let msg of messages"
        [message]="msg"
        [userName]="authService.currentUser()?.name || 'Usuario'">
      </app-message-bubble>
      
      <div class="typing-wrapper" *ngIf="isTyping">
        <div class="avatar-spacer">
          <div class="agent-avatar-small">
            <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="8" fill="#E4002B"/>
              <path d="M12 28V12H16.5C18.5 12 20 12.5 21 13.5C22 14.5 22.5 16 22.5 18C22.5 20 22 21.5 21 22.5C20 23.5 18.5 24 16.5 24H15V28H12ZM15 21H16.5C17.5 21 18.25 20.75 18.75 20.25C19.25 19.75 19.5 19 19.5 18C19.5 17 19.25 16.25 18.75 15.75C18.25 15.25 17.5 15 16.5 15H15V21Z" fill="white"/>
            </svg>
          </div>
        </div>
        <app-typing-indicator></app-typing-indicator>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
      height: 100%;
      min-height: 0;
    }
    .message-list-container {
      display: flex;
      flex-direction: column;
      padding: 1rem 0;
      height: 100%;
      overflow-y: auto;
      scroll-behavior: smooth;
    }
    .typing-wrapper {
      display: flex;
      gap: 1rem;
      max-width: 800px;
      margin: 0 auto;
      padding: 1rem 2rem;
      width: 100%;
      align-items: center;
    }
    .avatar-spacer {
      width: 40px;
      flex-shrink: 0;
      display: flex;
      justify-content: center;
    }
    .agent-avatar-small {
      width: 32px;
      height: 32px;
      border-radius: 9999px;
      overflow: hidden;
    }
    .agent-avatar-small svg {
      width: 100%;
      height: 100%;
    }
    @media (max-width: 768px) {
      .typing-wrapper {
        padding: 1rem;
      }
    }
  `]
})
export class MessageListComponent implements AfterViewChecked {
  @Input() messages: Message[] = [];
  @Input() isTyping = false;
  
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  
  constructor(public authService: AuthService) {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
