import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { QuarantinedDocument } from '../models/knowledge-document.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuarantineService {
  private http = inject(HttpClient);
  private apiUrl = environment.ingestionApiUrl || environment.apiBaseUrl;

  getQuarantinedDocuments(): Observable<QuarantinedDocument[]> {
    return this.http.get<QuarantinedDocument[]>(`${this.apiUrl}/api/knowledge-base/quarantine`);
  }

  approveDocument(documentId: string): Observable<{ filesProcessed: number, chunksIndexed: number, message: string }> {
    const encodedId = encodeURIComponent(documentId);
    return this.http.post<{ filesProcessed: number, chunksIndexed: number, message: string }>(`${this.apiUrl}/api/knowledge-base/quarantine/${encodedId}/approve`, {});
  }

  rejectDocument(documentId: string, reason: string): Observable<void> {
    const encodedId = encodeURIComponent(documentId);
    return this.http.delete<void>(`${this.apiUrl}/api/knowledge-base/quarantine/${encodedId}`);
  }

  getPendingCount(): Observable<number> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/api/knowledge-base/quarantine/count`).pipe(map(r => r.count));
  }
}
