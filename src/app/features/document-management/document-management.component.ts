import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KnowledgeDocument, UploadKnowledgeBaseResponse } from '../../core/models/knowledge-document.model';
import { DocumentManagementService } from '../../core/services/document-management.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-document-management',
  standalone: true,
  imports: [CommonModule, IconComponent, BadgeComponent, ConfirmModalComponent],
  templateUrl: './document-management.component.html',
  styleUrls: ['./document-management.component.scss']
})
export class DocumentManagementComponent implements OnInit {
  private documentService = inject(DocumentManagementService);

  documents = signal<KnowledgeDocument[]>([]);
  isLoading = signal<boolean>(true);
  isUpdating = signal<string | null>(null);
  activeArea = signal<string>('');
  
  // Modal State
  showModal = signal<boolean>(false);
  modalTitle = signal<string>('');
  modalMessage = signal<string>('');
  modalVariant = signal<'primary' | 'danger'>('primary');
  
  pendingAction = signal<'delete' | 'update' | null>(null);
  pendingDocumentId = signal<string | null>(null);
  pendingFile = signal<File | null>(null);

  ngOnInit() {
    this.loadDocuments('comedor');
  }

  getFileName(fullPath: string): string {
    if (!fullPath) return '';
    const parts = fullPath.split('/');
    return parts[parts.length - 1];
  }

  getFolderPath(fullPath: string): string {
    if (!fullPath) return '';
    const parts = fullPath.split('/');
    if (parts.length <= 1) return '';
    return parts.slice(0, -1).join('/');
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
      
      this.pendingAction.set('update');
      this.pendingDocumentId.set(doc.id);
      this.pendingFile.set(file);
      
      this.modalTitle.set('Reemplazar documento');
      this.modalMessage.set(`¿Estás seguro de que deseas reemplazar el documento "${doc.name}" por el archivo "${file.name}"? Esta acción será auditada.`);
      this.modalVariant.set('primary');
      this.showModal.set(true);
      
      input.value = ''; // Reset input
    }
  }

  deleteDocument(docId: string) {
    this.pendingAction.set('delete');
    this.pendingDocumentId.set(docId);
    
    this.modalTitle.set('Eliminar documento');
    this.modalMessage.set('¿Estás seguro de que deseas eliminar este documento? Esta acción no se puede deshacer.');
    this.modalVariant.set('danger');
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.pendingAction.set(null);
    this.pendingDocumentId.set(null);
    this.pendingFile.set(null);
  }

  executePendingAction() {
    const action = this.pendingAction();
    const docId = this.pendingDocumentId();
    const file = this.pendingFile();

    this.showModal.set(false); // Hide modal immediately

    if (action === 'update' && docId && file) {
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
    } else if (action === 'delete' && docId) {
      this.documentService.deleteDocument(docId).subscribe({
        next: () => {
          this.loadDocuments();
        },
        error: (err) => {
          console.error('Error deleting document', err);
        }
      });
    }

    this.closeModal();
  }
}
