import { Component, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { ChatInputComponent } from './components/chat-input/chat-input.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ChatAreaComponent } from './components/chat-area/chat-area.component';
import { ChatService } from '../../core/services/chat.service';
import { ConversationService } from '../../core/services/conversation.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, HeaderComponent, ChatInputComponent, SidebarComponent, ChatAreaComponent],
  template: `
    <div class="app-layout">
      <app-header (toggleSidebar)="toggleSidebar()"></app-header>
      
      <div class="main-container">
        <!-- Sidebar -->
        <aside class="sidebar-placeholder" [class.open]="sidebarOpen()">
          <div class="sidebar-content">
            <app-sidebar></app-sidebar>
          </div>
          <div class="sidebar-backdrop" (click)="toggleSidebar()"></div>
        </aside>

        <!-- Main Chat Area -->
        <main class="chat-main">
          <div class="chat-area-wrapper">
             <app-chat-area #chatArea></app-chat-area>
          </div>
          
          <app-chat-input 
            [disabled]="chatService.isStreaming()"
            (onSubmit)="sendMessage($event)">
          </app-chat-input>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      background-color: var(--white, #fff);
    }
    .main-container {
      display: flex;
      flex: 1;
      overflow: hidden;
      position: relative;
    }
    .sidebar-placeholder {
      width: 280px;
      background-color: var(--gray-100, #F5F5F5);
      border-right: 1px solid var(--gray-200, #E5E5E5);
      transition: transform 0.3s ease;
      z-index: 20;
    }
    .sidebar-content {
      height: 100%;
      width: 280px;
      background-color: var(--gray-100, #F5F5F5);
      position: relative;
      z-index: 21;
    }
    .sidebar-backdrop {
      display: none;
      position: fixed;
      inset: 0;
      background-color: rgba(0,0,0,0.5);
      z-index: 20;
    }
    .chat-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      background-color: var(--gray-50, #FAFAFA);
      min-width: 0;
    }
    
    .chat-area-wrapper {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    @media (max-width: 768px) {
      .sidebar-placeholder {
        position: absolute;
        height: 100%;
        transform: translateX(-100%);
      }
      .sidebar-placeholder.open {
        transform: translateX(0);
      }
      .sidebar-placeholder.open .sidebar-backdrop {
        display: block;
      }
    }
  `]
})
export class ChatComponent {
  sidebarOpen = signal(false);
  @ViewChild('chatArea') chatArea!: ChatAreaComponent;

  constructor(
    public chatService: ChatService,
    private conversationService: ConversationService
  ) {}

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }

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
