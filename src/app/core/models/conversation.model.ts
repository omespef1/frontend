import { Message } from './message.model';

export interface Conversation {
  id: string;
  threadId?: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}
