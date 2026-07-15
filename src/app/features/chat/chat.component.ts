import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatInputComponent } from './components/chat-input/chat-input.component';
import { ChatAreaComponent } from './components/chat-area/chat-area.component';
import { ChatService } from '../../core/services/chat.service';
import { ConversationService } from '../../core/services/conversation.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, ChatInputComponent, ChatAreaComponent],
  template: `
    <div class="chat-area-wrapper">
      <app-chat-area #chatArea></app-chat-area>
    </div>
    
    <app-chat-input 
      [disabled]="chatService.isStreaming()"
      (onSubmit)="sendMessage($event)">
    </app-chat-input>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
      height: 100%;
      min-height: 0;
    }
    .chat-area-wrapper {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
  `]
})
export class ChatComponent {
  @ViewChild('chatArea') chatArea!: ChatAreaComponent;

  constructor(
    public chatService: ChatService,
    private conversationService: ConversationService
  ) {}

  sendMessage(text: string) {
    let convId = this.conversationService.activeConversationId();
    if (!convId) {
      convId = this.conversationService.createConversation();
    }
    
    this.conversationService.addMessage(convId, {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date()
    });
    
    this.chatArea.streamAgentResponse(text, convId);
  }
}
