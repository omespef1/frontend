import { Injectable, signal } from '@angular/core';
import { Conversation } from '../models/conversation.model';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  conversations = signal<Conversation[]>([]);
  activeConversationId = signal<string | null>(null);

  constructor() {
    this.loadConversations();
  }

  private loadConversations() {
    const saved = localStorage.getItem('kfc_conversations');
    if (saved) {
      this.conversations.set(JSON.parse(saved));
    } else {
      this.conversations.set([]);
    }
  }

  private saveConversations() {
    localStorage.setItem('kfc_conversations', JSON.stringify(this.conversations()));
  }

  createConversation(): string {
    const newId = 'conv_' + Date.now();
    const newConv: Conversation = {
      id: newId,
      title: 'Nueva conversación',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.conversations.update((convs: Conversation[]) => [newConv, ...convs]);
    this.activeConversationId.set(newId);
    this.saveConversations();
    return newId;
  }

  addMessage(conversationId: string, message: Message) {
    this.conversations.update((convs: Conversation[]) => {
      const idx = convs.findIndex((c: Conversation) => c.id === conversationId);
      if (idx !== -1) {
        const conv = { ...convs[idx] };
        conv.messages = [...conv.messages, message];
        
        if (conv.messages.length === 1 && message.role === 'user') {
          conv.title = message.content.substring(0, 30) + (message.content.length > 30 ? '...' : '');
        }
        
        conv.updatedAt = new Date();
        const updated = [...convs];
        updated[idx] = conv;
        return updated.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      }
      return convs;
    });
    this.saveConversations();
  }

  updateLastMessage(conversationId: string, content: string, sources?: any[], richContent?: any[]) {
    this.conversations.update((convs: Conversation[]) => {
      const idx = convs.findIndex((c: Conversation) => c.id === conversationId);
      if (idx !== -1) {
        const conv = { ...convs[idx] };
        if (conv.messages.length > 0) {
          const lastMsgIdx = conv.messages.length - 1;
          conv.messages[lastMsgIdx] = {
            ...conv.messages[lastMsgIdx],
            content: conv.messages[lastMsgIdx].content + content,
            sources: sources ? sources : conv.messages[lastMsgIdx].sources,
            richContent: richContent ? richContent : conv.messages[lastMsgIdx].richContent
          };
          conv.updatedAt = new Date();
        }
        const updated = [...convs];
        updated[idx] = conv;
        return updated;
      }
      return convs;
    });
    this.saveConversations();
  }

  getConversation(id: string): Conversation | undefined {
    return this.conversations().find((c: Conversation) => c.id === id);
  }

  setThreadId(id: string, threadId: string) {
    this.conversations.update((convs: Conversation[]) => {
      const idx = convs.findIndex((c: Conversation) => c.id === id);
      if (idx !== -1) {
        const conv = { ...convs[idx], threadId };
        const updated = [...convs];
        updated[idx] = conv;
        return updated;
      }
      return convs;
    });
    this.saveConversations();
  }

  deleteConversation(id: string) {
    this.conversations.update((convs: Conversation[]) => convs.filter((c: Conversation) => c.id !== id));
    if (this.activeConversationId() === id) {
      this.activeConversationId.set(null);
    }
    this.saveConversations();
  }
}
