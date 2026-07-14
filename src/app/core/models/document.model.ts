export type DocumentStatus = 'uploading' | 'auditing' | 'indexing' | 'completed' | 'rejected';

export interface DocumentUpload {
  id: string;
  name: string;
  status: DocumentStatus;
  progress: number;
  uploadedAt: Date;
  rejectReason?: string;
}
