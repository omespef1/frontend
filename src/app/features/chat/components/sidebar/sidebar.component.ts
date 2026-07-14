import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ConversationListComponent } from './conversation-list/conversation-list.component';
import { DocumentUploadComponent } from './document-upload/document-upload.component';
import { AuthService } from '../../../../core/services/auth.service';
import { QuarantineService } from '../../../../core/services/quarantine.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, ConversationListComponent, DocumentUploadComponent],
  template: `
    <div class="sidebar-wrapper">
      <div class="conv-section">
        <app-conversation-list></app-conversation-list>
      </div>
      
      @if (canUpload()) {
        <div class="upload-section">
          <app-document-upload></app-document-upload>
        </div>
      }

      @if (canUpload()) {
        <div class="nav-section">
          <a routerLink="/documents" class="nav-link">
            <span class="icon">📁</span> Gestión Documentos
          </a>
        </div>
      }

      @if (isSecAdmin()) {
        <div class="nav-section quarantine-nav">
          <a routerLink="/quarantine" class="nav-link quarantine-link">
            <span class="icon">⚠️</span> Cuarentena 
            @if (pendingCount() !== null && pendingCount()! > 0) {
              <span class="badge">{{ pendingCount() }}</span>
            }
          </a>
        </div>
      }
    </div>
  `,
  styles: [`
    .sidebar-wrapper {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .conv-section {
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }
    .upload-section {
      flex-shrink: 0;
    }
    .nav-section {
      flex-shrink: 0;
      padding: 12px 16px;
      border-top: 1px solid var(--kfc-border, #E5E5E5);
    }
    .nav-link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      text-decoration: none;
      color: var(--kfc-text-primary, #333);
      border-radius: 4px;
      font-weight: 500;
      transition: background 0.2s;
    }
    .nav-link:hover {
      background: var(--kfc-hover, #F0F0F0);
    }
    .quarantine-link {
      color: #dc3545;
    }
    .quarantine-link:hover {
      background: rgba(220, 53, 69, 0.1);
    }
    .badge {
      background: #dc3545;
      color: white;
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 10px;
      margin-left: auto;
    }
  `]
})
export class SidebarComponent implements OnInit {
  canUpload = computed(() => {
    const role = this.authService.userRole();
    return role === 'Supervisor' || role === 'SecAdmin';
  });

  isSecAdmin = computed(() => {
    return this.authService.userRole() === 'SecAdmin';
  });

  pendingCount = signal<number | null>(null);

  constructor(
    private authService: AuthService,
    private quarantineService: QuarantineService
  ) {}

  ngOnInit() {
    if (this.isSecAdmin()) {
      this.quarantineService.getPendingCount().subscribe(count => {
        this.pendingCount.set(count);
      });
    }
  }
}
