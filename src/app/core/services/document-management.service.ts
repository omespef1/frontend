import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { KnowledgeDocument, UploadKnowledgeBaseResponse } from '../models/knowledge-document.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentManagementService {
  private http = inject(HttpClient);
  private apiUrl = environment.ingestionApiUrl || environment.apiBaseUrl;

  // --- MOCK TEMPORAL (hasta que el backend implemente los endpoints) ---
  private mockDocuments: KnowledgeDocument[] = [
    { id: '1', name: 'KFC-Comedor Manual.pdf', area: 'comedor', status: 'indexed',
      indexedAt: new Date('2026-06-01T10:30:00Z'), fileHash: 'abc123hash', chunksCount: 42, fileSizeBytes: 3800000 },
    { id: '2', name: 'Políticas RRHH 2026.pdf', area: 'rrhh', status: 'indexed',
      indexedAt: new Date('2026-06-05T09:15:00Z'), fileHash: 'def456hash', chunksCount: 85, fileSizeBytes: 5200000 },
    { id: '3', name: 'Presupuestos Q1 2026.xlsx', area: 'financiero', status: 'indexed',
      indexedAt: new Date('2026-06-10T14:45:00Z'), fileHash: 'ghi789hash', chunksCount: 15, fileSizeBytes: 1200000 }
  ];

  getDocuments(area?: string): Observable<KnowledgeDocument[]> {
    // TODO: Reemplazar por HTTP GET cuando el backend tenga el endpoint
    // return this.http.get<KnowledgeDocument[]>(`${this.apiUrl}/api/knowledge-base/documents`, { params: area ? { area } : {} });
    return of(this.mockDocuments.filter(d => !area || d.area === area)).pipe(delay(500));
  }

  updateDocument(documentId: string, file: File): Observable<UploadKnowledgeBaseResponse> {
    // TODO: Reemplazar por HTTP PUT cuando el backend tenga el endpoint
    // const formData = new FormData();
    // formData.append('zipFile', file); // Use same key as upload for consistency
    // return this.http.put<UploadKnowledgeBaseResponse>(`${this.apiUrl}/api/knowledge-base/documents/${documentId}`, formData);
    return of({ filesProcessed: 1, chunksIndexed: 12, chunksGenerated: 12, warnings: [], errors: [], duration: '00:00:05' }).pipe(delay(2000));
  }

  deleteDocument(documentId: string): Observable<void> {
    // TODO: Reemplazar por HTTP DELETE
    // return this.http.delete<void>(`${this.apiUrl}/api/knowledge-base/documents/${documentId}`);
    return of(void 0).pipe(delay(500));
  }
}
