import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KnowledgeDocument, UploadKnowledgeBaseResponse } from '../../core/models/knowledge-document.model';
import { DocumentManagementService } from '../../core/services/document-management.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';

@Component({
  selector: 'app-document-management',
  standalone: true,
  imports: [CommonModule, IconComponent, BadgeComponent],
  templateUrl: './document-management.component.html',
  styleUrls: ['./document-management.component.scss']
})
export class DocumentManagementComponent implements OnInit {
  private documentService = inject(DocumentManagementService);

  documents = signal<KnowledgeDocument[]>([]);
  isLoading = signal<boolean>(true);
  isUpdating = signal<string | null>(null);

  ngOnInit() {
    this.loadDocuments();
  }

  loadDocuments(area?: string) {
    this.isLoading.set(true);
    this.documentService.getDocuments(area).subscribe({
      next: (docs) => {
        this.documents.set(docs);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading documents', err);
        this.isLoading.set(false);
      }
    });
  }

  onFileSelected(event: Event, doc: KnowledgeDocument) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.updateDocument(doc.id, file);
    }
  }

  updateDocument(docId: string, file: File) {
    this.isUpdating.set(docId);
    this.documentService.updateDocument(docId, file).subscribe({
      next: (res: UploadKnowledgeBaseResponse) => {
        console.log('Document updated', res);
        this.isUpdating.set(null);
        this.loadDocuments();
      },
      error: (err) => {
        console.error('Error updating document', err);
        this.isUpdating.set(null);
      }
    });
  }

  deleteDocument(docId: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este documento?')) {
      this.documentService.deleteDocument(docId).subscribe({
        next: () => {
          this.loadDocuments();
        },
        error: (err) => {
          console.error('Error deleting document', err);
        }
      });
    }
  }
}
