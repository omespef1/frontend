import { RichContentBlock } from './rich-content.model';

export interface Source {
  name: string;
  section?: string;
  url?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  richContent?: RichContentBlock[];
  timestamp: Date;
}
