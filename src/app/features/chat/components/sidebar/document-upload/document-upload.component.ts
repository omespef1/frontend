import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentUploadService, UploadStatus } from '../../../../../core/services/document-upload.service';
import { IconComponent } from '../../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="upload-container">
      <div class="upload-header">
        <app-icon name="upload" size="18"></app-icon>
        <span>Ingesta de Documentos</span>
      </div>
      
      <div 
        class="drop-zone" 
        [class.drag-over]="isDragging()"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
        (click)="fileInput.click()">
        
        <input 
          type="file" 
          #fileInput 
          hidden 
          accept=".pdf,.docx,.md,.txt,.xlsx,.zip"
          (change)="onFileSelected($event)">
          
        <ng-container *ngIf="!currentStatus()">
          <p class="drop-text">Haz clic o arrastra un archivo aquí</p>
          <p class="drop-hint">PDF, DOCX, MD, TXT, ZIP (Max 50MB)</p>
        </ng-container>
        
        <ng-container *ngIf="currentStatus() as status">
          <div class="status-container">
            <div class="status-icon" [ngSwitch]="status.status">
              <span *ngSwitchCase="'uploading'">⏳</span>
              <span *ngSwitchCase="'auditing'">🔍</span>
              <span *ngSwitchCase="'indexing'">⚙️</span>
              <span *ngSwitchCase="'completed'">✅</span>
              <span *ngSwitchCase="'rejected'">❌</span>
            </div>
            <div class="status-text">
              <div class="status-msg" [class.error]="status.status === 'rejected'">
                {{ status.message || 'Procesando...' }}
              </div>
              <div class="progress-bar-container" *ngIf="status.status !== 'completed' && status.status !== 'rejected'">
                <div class="progress-bar" [style.width.%]="status.progress"></div>
              </div>
            </div>
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .upload-container {
      padding: 1rem;
      border-top: 1px solid var(--gray-200, #E5E5E5);
      background-color: var(--white, #fff);
    }
    .upload-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--gray-900, #1A1A1A);
      margin-bottom: 0.75rem;
    }
    .drop-zone {
      border: 2px dashed var(--gray-300, #D4D4D4);
      border-radius: 8px;
      padding: 1rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
      background-color: var(--gray-50, #FAFAFA);
    }
    .drop-zone:hover, .drop-zone.drag-over {
      border-color: var(--kfc-red, #E4002B);
      background-color: var(--kfc-red-light, #FDE8EC);
    }
    .drop-text {
      font-size: 0.875rem;
      color: var(--gray-700, #404040);
      margin-bottom: 0.25rem;
    }
    .drop-hint {
      font-size: 0.75rem;
      color: var(--gray-500, #737373);
    }
    .status-container {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-align: left;
    }
    .status-icon {
      font-size: 1.25rem;
    }
    .status-text {
      flex: 1;
    }
    .status-msg {
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--gray-900, #1A1A1A);
      margin-bottom: 0.25rem;
    }
    .status-msg.error {
      color: var(--error, #DC2626);
    }
    .progress-bar-container {
      height: 4px;
      background-color: var(--gray-200, #E5E5E5);
      border-radius: 2px;
      overflow: hidden;
    }
    .progress-bar {
      height: 100%;
      background-color: var(--kfc-red, #E4002B);
      transition: width 0.3s;
    }
  `]
})
export class DocumentUploadComponent {
  isDragging = signal(false);
  currentStatus = signal<UploadStatus | null>(null);

  constructor(private uploadService: DocumentUploadService) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  private handleFile(file: File) {
    if (file.size > 50 * 1024 * 1024) {
      this.currentStatus.set({ status: 'rejected', progress: 0, message: 'Archivo excede 50MB' });
      return;
    }
    
    this.uploadService.uploadDocument(file).subscribe({
      next: (status) => this.currentStatus.set(status),
      complete: () => {
        setTimeout(() => this.currentStatus.set(null), 3000);
      }
    });
  }
}
