import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuarantinedDocument } from '../../core/models/knowledge-document.model';
import { QuarantineService } from '../../core/services/quarantine.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { ToastService } from '../../core/services/toast.service';
import { GlobalProgressService } from '../../core/services/global-progress.service';

@Component({
  selector: 'app-quarantine',
  standalone: true,
  imports: [CommonModule, IconComponent, BadgeComponent, ConfirmModalComponent],
  templateUrl: './quarantine.component.html',
  styleUrls: ['./quarantine.component.scss']
})
export class QuarantineComponent implements OnInit {
  private quarantineService = inject(QuarantineService);
  private toastService = inject(ToastService);
  private globalProgressService = inject(GlobalProgressService);

  documents = signal<QuarantinedDocument[]>([]);
  isLoading = signal<boolean>(true);
  isProcessing = signal<string | null>(null);
  
  selectedDoc = signal<QuarantinedDocument | null>(null);

  // Modal State
  showConfirmModal = signal<boolean>(false);
  confirmModalTitle = signal<string>('');
  confirmModalMessage = signal<string>('');
  confirmModalVariant = signal<'primary' | 'danger'>('primary');
  
  pendingAction = signal<'approve' | 'reject' | null>(null);
  pendingDocumentId = signal<string | null>(null);

  ngOnInit() {
    this.loadDocuments();
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
    return parts.slice(0, parts.length - 1).join('/');
  }

  getUploader(uploader: string | undefined): string {
    if (!uploader || uploader.toLowerCase() === 'unknown') return 'Sistema';
    return uploader;
  }

  getReason(reason: string | undefined): string {
    if (!reason || reason.toLowerCase() === 'unknown') return 'Pendiente de revisión';
    return reason;
  }

  loadDocuments() {
    this.isLoading.set(true);
    this.quarantineService.getQuarantinedDocuments().subscribe({
      next: (docs) => {
        this.documents.set(docs);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading quarantined docs', err);
        this.isLoading.set(false);
      }
    });
  }

  approve(docId: string) {
    this.pendingAction.set('approve');
    this.pendingDocumentId.set(docId);
    
    this.confirmModalTitle.set('Aprobar documento');
    this.confirmModalMessage.set('¿Confirmas que deseas aprobar este documento y pasarlo al índice?');
    this.confirmModalVariant.set('primary');
    this.showConfirmModal.set(true);
  }

  reject(docId: string) {
    this.pendingAction.set('reject');
    this.pendingDocumentId.set(docId);
    
    this.confirmModalTitle.set('Rechazar documento');
    this.confirmModalMessage.set('¿Confirmas que deseas rechazar y eliminar definitivamente este documento?');
    this.confirmModalVariant.set('danger');
    this.showConfirmModal.set(true);
  }

  closeConfirmModal() {
    this.showConfirmModal.set(false);
    this.pendingAction.set(null);
    this.pendingDocumentId.set(null);
  }

  executePendingAction() {
    const action = this.pendingAction();
    const docId = this.pendingDocumentId();

    this.showConfirmModal.set(false); // Hide modal immediately

    if (action === 'approve' && docId) {
      this.isProcessing.set(docId);
      this.globalProgressService.show();
      this.quarantineService.approveDocument(docId).subscribe({
        next: (res) => {
          this.isProcessing.set(null);
          this.toastService.show('Documento aprobado exitosamente. Se está procesando...', 'info');
          
          setTimeout(() => {
            this.globalProgressService.hide();
            this.toastService.show('Indexación finalizada exitosamente.', 'success');
            // Optimistic UI update
            this.documents.update(docs => docs.filter(d => (d.originalBlobName || d.id) !== docId));
          }, 4500);
        },
        error: (err) => {
          console.error('Error approving doc', err);
          this.toastService.show('Error al aprobar el documento. Intente de nuevo.', 'error');
          this.isProcessing.set(null);
          this.globalProgressService.hide();
        }
      });
    } else if (action === 'reject' && docId) {
      this.isProcessing.set(docId);
      this.quarantineService.rejectDocument(docId, '').subscribe({
        next: () => {
          this.isProcessing.set(null);
          this.toastService.show('El documento fue rechazado y eliminado exitosamente.', 'success');
          // Optimistic UI update
          this.documents.update(docs => docs.filter(d => (d.originalBlobName || d.id) !== docId));
        },
        error: (err) => {
          console.error('Error rejecting doc', err);
          this.toastService.show('Error al rechazar el documento. Intente de nuevo.', 'error');
          this.isProcessing.set(null);
        }
      });
    }

    this.closeConfirmModal();
  }

  viewDetails(doc: QuarantinedDocument) {
    this.selectedDoc.set(doc);
  }

  closeModal() {
    this.selectedDoc.set(null);
  }
}
