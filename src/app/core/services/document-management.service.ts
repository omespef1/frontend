import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KnowledgeDocument, UploadKnowledgeBaseResponse } from '../models/knowledge-document.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentManagementService {
  private http = inject(HttpClient);
  private apiUrl = environment.ingestionApiUrl || environment.apiBaseUrl;

  getDocuments(area?: string): Observable<KnowledgeDocument[]> {
    return this.http.get<KnowledgeDocument[]>(`${this.apiUrl}/api/knowledge-base/documents`, { params: area ? { area } : {} });
  }

  updateDocument(documentId: string, file: File): Observable<UploadKnowledgeBaseResponse> {
    const formData = new FormData();
    formData.append('zipFile', file); // Use same key as upload for consistency
    return this.http.put<UploadKnowledgeBaseResponse>(`${this.apiUrl}/api/knowledge-base/documents/${documentId}`, formData);
  }

  deleteDocument(documentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/knowledge-base/documents/${documentId}`);
  }
}
