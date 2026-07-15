import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { KnowledgeDocument, UploadKnowledgeBaseResponse } from '../models/knowledge-document.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentManagementService {
  private http = inject(HttpClient);
  private apiUrl = environment.ingestionApiUrl || environment.apiBaseUrl;

  getDocuments(area?: string): Observable<KnowledgeDocument[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/search-documents`).pipe(
      map(docs => docs.map(doc => ({
        id: doc.fileHash || doc.FileHash,
        name: doc.fileName || doc.FileName,
        area: doc.area || doc.Area,
        fileHash: doc.fileHash || doc.FileHash,
        indexedAt: doc.indexedAtUtc || doc.IndexedAtUtc ? new Date(doc.indexedAtUtc || doc.IndexedAtUtc) : new Date(),
        status: 'indexed', // Default as discussed
        chunksCount: 0     // Default
      })))
    );
  }

  updateDocument(documentId: string, file: File, area: string = 'Comedor'): Observable<UploadKnowledgeBaseResponse> {
    const formData = new FormData();
    formData.append('File', file);
    formData.append('FileHash', documentId);
    formData.append('NameArea', area);
    formData.append('IsAuditable', 'true');
    return this.http.put<UploadKnowledgeBaseResponse>(`${this.apiUrl}/api/search-documents/replace`, formData);
  }

  deleteDocument(documentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/search-documents/${documentId}`);
  }
}
