import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { of, delay } from 'rxjs';
import { MOCK_QUARANTINE_DOCS, MOCK_DOCUMENTS, MOCK_UPLOAD_RESPONSE } from '../mocks/mock-data';

export const mockInterceptor: HttpInterceptorFn = (req, next) => {
  if (!environment.useMockMode) {
    return next(req);
  }

  // Mock for Quarantine endpoints
  if (req.url.includes('/api/knowledge-base/quarantine')) {
    if (req.method === 'GET') {
      return of(new HttpResponse({
        body: req.url.endsWith('/count') ? { count: MOCK_QUARANTINE_DOCS.length } : MOCK_QUARANTINE_DOCS,
        status: 200
      })).pipe(delay(500));
    }
    
    if (req.method === 'POST' || req.method === 'DELETE') {
      return of(new HttpResponse({
        body: { success: true, filesProcessed: 1, chunksIndexed: 5, message: 'Operación simulada' },
        status: 200
      })).pipe(delay(500));
    }
  }

  // Mock for Document Management endpoints
  if (req.url.includes('/api/search-documents')) {
    if (req.method === 'GET') {
      const urlParams = new URLSearchParams(req.url.split('?')[1]);
      const area = urlParams.get('area');
      const filteredDocs = area ? MOCK_DOCUMENTS.filter(d => d.area.toLowerCase() === area.toLowerCase()) : MOCK_DOCUMENTS;
      
      // Transform mock data to match the new backend response (SearchDocumentSummaryModel)
      const mappedDocs = filteredDocs.map(d => ({
        Area: d.area,
        FileName: d.name,
        FileHash: d.fileHash || d.id,
        IndexedAtUtc: d.indexedAt.toISOString()
      }));

      return of(new HttpResponse({
        body: mappedDocs,
        status: 200
      })).pipe(delay(500));
    }
  }

  if (req.url.includes('/api/knowledge-base/documents')) {

    if (req.method === 'PUT' || req.method === 'POST') {
      return of(new HttpResponse({
        body: MOCK_UPLOAD_RESPONSE,
        status: 200
      })).pipe(delay(1500));
    }

    if (req.method === 'DELETE') {
      return of(new HttpResponse({
        body: null,
        status: 204
      })).pipe(delay(500));
    }
  }

  return next(req);
};
