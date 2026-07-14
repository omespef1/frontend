import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, BadgeComponent, IconComponent],
  template: `
    <header class="header">
      <div class="header-left">
        <button class="menu-btn" (click)="toggleSidebar.emit()">
          <app-icon name="menu" size="24"></app-icon>
        </button>
        <div class="logo">
          <!-- KFC Logo Placeholder or SVG -->
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="8" fill="#E4002B"/>
            <path d="M12 28V12H16.5C18.5 12 20 12.5 21 13.5C22 14.5 22.5 16 22.5 18C22.5 20 22 21.5 21 22.5C20 23.5 18.5 24 16.5 24H15V28H12ZM15 21H16.5C17.5 21 18.25 20.75 18.75 20.25C19.25 19.75 19.5 19 19.5 18C19.5 17 19.25 16.25 18.75 15.75C18.25 15.25 17.5 15 16.5 15H15V21Z" fill="white"/>
          </svg>
          <span class="title">Agente de Comedor</span>
        </div>
      </div>
      <div class="header-right" *ngIf="user()">
        <span class="user-name">{{ user()?.name }}</span>
        <app-badge color="red">{{ user()?.role }}</app-badge>
        <button class="logout-btn" (click)="logout()" title="Cerrar Sesión">
          <app-icon name="logout" size="20" color="#737373"></app-icon>
        </button>
      </div>
    </header>
  `,
  styles: [`
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
      padding: 0 1.5rem;
      background-color: var(--white, #fff);
      border-bottom: 1px solid var(--gray-200, #E5E5E5);
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .menu-btn {
      display: none;
      padding: 0.5rem;
      border-radius: 0.375rem;
      color: var(--gray-700, #404040);
    }
    .menu-btn:hover {
      background-color: var(--gray-100, #F5F5F5);
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .title {
      font-weight: 600;
      font-size: 1.125rem;
      color: var(--gray-900, #1A1A1A);
    }
    .header-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .user-name {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--gray-700, #404040);
    }
    .logout-btn {
      padding: 0.5rem;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .logout-btn:hover {
      background-color: var(--gray-100, #F5F5F5);
    }
    
    @media (max-width: 768px) {
      .menu-btn {
        display: block;
      }
      .user-name {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  user;

  constructor(private authService: AuthService) {
    this.user = this.authService.currentUser;
  }

  logout() {
    this.authService.logout();
  }
}
