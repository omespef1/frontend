import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ConversationService } from './conversation.service';
import { Source } from '../models/message.model';
import { RichContentBlock } from '../models/rich-content.model';
import { environment } from '../../../environments/environment';

export type StreamEvent = 
  | { type: 'token'; content: string }
  | { type: 'sources'; documents: Source[] }
  | { type: 'rich_content'; blocks: RichContentBlock[] }
  | { type: 'done' }
  | { type: 'error'; message: string };

interface ChatRequest {
  question: string;
  sessionId: string;
  conversationId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  isStreaming = signal<boolean>(false);

  constructor(
    private authService: AuthService,
    private conversationService: ConversationService
  ) {}

  queryAgent(question: string, conversationId: string): Observable<StreamEvent> {
    return new Observable(observer => {
      this.isStreaming.set(true);

      const body: ChatRequest = {
        question,
        sessionId: crypto.randomUUID()
      };

      // SSE via fetch
      fetch(`${environment.apiBaseUrl}/api/v1/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authService.getToken()}`
        },
        body: JSON.stringify(body)
      }).then(async response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // The backend sends `data: {content}\n\n` without escaping newlines.
          // To parse this reliably, we remove the very first 'data:' if present.
          if (buffer.startsWith('data:')) {
            buffer = buffer.substring(5);
          }

          // Then we split by '\n\ndata:' which perfectly isolates each chunk
          const separator = '\n\ndata:';
          const parts = buffer.split(separator);
          
          // Keep the last incomplete part in the buffer
          buffer = parts.pop() || '';

          for (let i = 0; i < parts.length; i++) {
            let part = parts[i];
            // The backend formats it as `data: {content}`, so there's one space after the colon.
            if (part.startsWith(' ')) {
              part = part.substring(1);
            }
            observer.next({ type: 'token', content: part });
          }
        }
        
        // Process the final chunk remaining in the buffer
        if (buffer.length > 0) {
            let part = buffer;
            if (part.startsWith(' ')) {
              part = part.substring(1);
            }
            if (part.endsWith('\n\n')) {
              part = part.substring(0, part.length - 2);
            }
            if (part.length > 0) {
              observer.next({ type: 'token', content: part });
            }
        }

        observer.next({ type: 'done' });
        observer.complete();
        this.isStreaming.set(false);
      }).catch(err => {
        observer.error(err);
        this.isStreaming.set(false);
      });
    });
  }
}
