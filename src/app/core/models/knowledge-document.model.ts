export interface KnowledgeDocument {
  id: string;
  name: string;
  area: string;
  status: 'processing' | 'indexed' | 'error';
  indexedAt: Date;
  fileHash: string;
  chunksCount: number;
  fileSizeBytes?: number;
}

export interface QuarantinedDocument {
  id: string;
  name: string;
  uploadedBy: string;
  uploadedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  rejectReason: string;
  fileType?: string;
  fileSizeBytes?: number;
  area?: string;
  originalBlobName?: string;
}

export interface UploadKnowledgeBaseResponse {
  filesProcessed: number;
  chunksGenerated: number;
  chunksIndexed: number;
  warnings: string[];
  errors: string[];
  duration: string;
}
