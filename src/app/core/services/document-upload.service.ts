import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { DocumentStatus } from '../models/document.model';
import { environment } from '../../../environments/environment';

export interface UploadStatus {
  status: DocumentStatus;
  progress: number;
  message?: string;
  filesProcessed?: number;
  chunksIndexed?: number;
  rejectReason?: string;
}

export interface UploadKnowledgeBaseResponse {
  filesProcessed: number;
  chunksGenerated: number;
  chunksIndexed: number;
  warnings: string[];
  errors: string[];
  duration: string;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentUploadService {
  private http = inject(HttpClient);
  private apiUrl = environment.ingestionApiUrl || environment.apiBaseUrl;

  constructor() { }

  uploadDocument(file: File, area: string = 'comedor'): Observable<UploadStatus> {
    const subject = new Subject<UploadStatus>();
    const formData = new FormData();

    const isZip = file.name.toLowerCase().endsWith('.zip');

    if (isZip) {
      formData.append('ZipFile', file, file.name);
      formData.append('Area', area);
      formData.append('IsAuditable', 'true');
    } else {
      formData.append('Files', file, file.name);
      formData.append('NameArea', area);
      formData.append('IsAuditable', 'true');
    }

    subject.next({ status: 'uploading', progress: 0, message: 'Subiendo archivo...' });

    const endpoint = isZip ? 'uploadzip' : 'documents';

    this.http.post<UploadKnowledgeBaseResponse>(
      `${this.apiUrl}/api/knowledge-base/${endpoint}`,
      formData,
      { reportProgress: true, observe: 'events' }
    ).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          const pct = Math.round(100 * event.loaded / event.total);
          subject.next({ status: 'uploading', progress: pct, message: `Subiendo... ${pct}%` });
        } else if (event.type === HttpEventType.Response) {
          const body = event.body!;
          if (body.errors && body.errors.length > 0) {
            subject.next({
              status: 'rejected',
              progress: 100,
              rejectReason: body.errors.join(', '),
              message: `Rechazado: ${body.errors.join(', ')}`
            });
          } else {
            subject.next({
              status: 'completed',
              progress: 100,
              filesProcessed: body.filesProcessed,
              chunksIndexed: body.chunksIndexed,
              message: `✓ ${body.filesProcessed} archivo(s) procesado(s), ${body.chunksIndexed} chunks indexados`
            });
          }
          subject.complete();
        }
      },
      error: (err) => {
        const errorMsg = err.error?.detail || err.error?.title || err.message || 'Error desconocido';
        subject.next({ status: 'rejected', progress: 0, rejectReason: errorMsg, message: `Error: ${errorMsg}` });
        subject.complete();
      }
    });

    return subject.asObservable();
  }
}
