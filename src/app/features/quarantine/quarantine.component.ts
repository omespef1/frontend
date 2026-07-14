import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuarantinedDocument } from '../../core/models/knowledge-document.model';
import { QuarantineService } from '../../core/services/quarantine.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';

@Component({
  selector: 'app-quarantine',
  standalone: true,
  imports: [CommonModule, IconComponent, BadgeComponent],
  templateUrl: './quarantine.component.html',
  styleUrls: ['./quarantine.component.scss']
})
export class QuarantineComponent implements OnInit {
  private quarantineService = inject(QuarantineService);

  documents = signal<QuarantinedDocument[]>([]);
  isLoading = signal<boolean>(true);
  isProcessing = signal<string | null>(null);
  
  selectedDoc = signal<QuarantinedDocument | null>(null);

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
    if (confirm('¿Confirmas que deseas aprobar este documento y pasarlo al índice?')) {
      this.isProcessing.set(docId);
      this.quarantineService.approveDocument(docId).subscribe({
        next: (res) => {
          console.log('Aprobado', res);
          this.isProcessing.set(null);
          this.loadDocuments();
        },
        error: (err) => {
          console.error('Error approving doc', err);
          alert('Error al aprobar el documento. Intente de nuevo.');
          this.isProcessing.set(null);
        }
      });
    }
  }

  reject(docId: string) {
    if (confirm('¿Confirmas que deseas rechazar y eliminar definitivamente este documento?')) {
      this.isProcessing.set(docId);
      this.quarantineService.rejectDocument(docId, '').subscribe({
        next: () => {
          this.isProcessing.set(null);
          this.loadDocuments();
        },
        error: (err) => {
          console.error('Error rejecting doc', err);
          alert('Error al rechazar el documento. Intente de nuevo.');
          this.isProcessing.set(null);
        }
      });
    }
  }

  viewDetails(doc: QuarantinedDocument) {
    this.selectedDoc.set(doc);
  }

  closeModal() {
    this.selectedDoc.set(null);
  }
}
