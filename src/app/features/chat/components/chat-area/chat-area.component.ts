import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationService } from '../../../../core/services/conversation.service';
import { ChatService } from '../../../../core/services/chat.service';
import { EmptyStateComponent } from './empty-state/empty-state.component';
import { MessageListComponent } from './message-list/message-list.component';

@Component({
  selector: 'app-chat-area',
  standalone: true,
  imports: [CommonModule, EmptyStateComponent, MessageListComponent],
  template: `
    <div class="chat-area-container">
      <ng-container *ngIf="messages().length === 0; else messageListTemplate">
        <app-empty-state (onSelectSuggestion)="handleSuggestion($event)"></app-empty-state>
      </ng-container>
      
      <ng-template #messageListTemplate>
        <app-message-list 
          [messages]="messages()"
          [isTyping]="chatService.isStreaming() && !hasAssistantResponseInFlight">
        </app-message-list>
      </ng-template>
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
    .chat-area-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      position: relative;
    }
  `]
})
export class ChatAreaComponent {
  
  activeConv = computed(() => {
    const id = this.conversationService.activeConversationId();
    if (!id) return null;
    return this.conversationService.getConversation(id);
  });
  
  messages = computed(() => this.activeConv()?.messages || []);
  hasAssistantResponseInFlight = false;

  constructor(
    private conversationService: ConversationService,
    public chatService: ChatService
  ) {}

  handleSuggestion(text: string) {
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
    
    this.streamAgentResponse(text, convId);
  }

  streamAgentResponse(question: string, convId: string) {
    this.hasAssistantResponseInFlight = false;
    const assistantMsgId = 'msg_' + Date.now();
    this.conversationService.addMessage(convId, {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date()
    });

    this.chatService.queryAgent(question, convId).subscribe({
      next: (event) => {
        this.hasAssistantResponseInFlight = true;
        if (event.type === 'token') {
          this.conversationService.updateLastMessage(convId, event.content);
        } else if (event.type === 'sources') {
          this.conversationService.updateLastMessage(convId, '', event.documents);
        } else if (event.type === 'rich_content') {
          this.conversationService.updateLastMessage(convId, '', undefined, event.blocks);
        }
      },
      error: (err) => {
        this.hasAssistantResponseInFlight = false;
        this.conversationService.updateLastMessage(convId, '\n\n**Error:** No se pudo procesar la respuesta.');
      },
      complete: () => {
        this.hasAssistantResponseInFlight = false;
      }
    });
  }
}
