import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationService } from '../../../../../core/services/conversation.service';
import { ConversationItemComponent } from '../conversation-item/conversation-item.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { IconComponent } from '../../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-conversation-list',
  standalone: true,
  imports: [CommonModule, ConversationItemComponent, ButtonComponent, IconComponent],
  template: `
    <div class="conv-list-container">
      <div class="new-chat-wrapper">
        <app-button variant="outline" class="w-full new-chat-btn" (onClick)="newConversation()">
          <app-icon name="plus" size="18" style="margin-right: 8px"></app-icon>
          Nueva Conversación
        </app-button>
      </div>
      
      <div class="list-scroll">
        @for (conv of conversations(); track conv.id) {
          <app-conversation-item
            [conversation]="conv"
            [isActive]="conv.id === activeId()"
            (onClick)="selectConversation(conv.id)"
            (onDelete)="deleteConversation(conv.id)">
          </app-conversation-item>
        }
        @empty {
          <div class="empty-list">No hay conversaciones previas</div>
        }
      </div>
    </div>
  `,
  styles: [`
    .conv-list-container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .new-chat-wrapper {
      padding: 1rem;
    }
    .new-chat-btn {
      width: 100%;
      border-color: var(--gray-300, #D4D4D4);
      background-color: var(--white, #fff);
      display: flex;
    }
    .new-chat-btn:hover {
      border-color: var(--kfc-red, #E4002B);
      color: var(--kfc-red, #E4002B);
      background-color: var(--kfc-red-light, #FDE8EC);
    }
    .w-full { width: 100%; }
    .list-scroll {
      flex: 1;
      overflow-y: auto;
    }
    .empty-list {
      padding: 2rem 1rem;
      text-align: center;
      color: var(--gray-500, #737373);
      font-size: 0.875rem;
    }
  `]
})
export class ConversationListComponent {
  conversations = computed(() => this.conversationService.conversations());
  activeId = computed(() => this.conversationService.activeConversationId());

  constructor(private conversationService: ConversationService) {}

  newConversation() {
    this.conversationService.createConversation();
  }

  selectConversation(id: string) {
    this.conversationService.activeConversationId.set(id);
  }

  deleteConversation(id: string) {
    if(confirm('¿Estás seguro de que deseas eliminar esta conversación?')) {
       this.conversationService.deleteConversation(id);
    }
  }
}
