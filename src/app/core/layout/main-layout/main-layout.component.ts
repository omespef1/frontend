import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../features/chat/components/header/header.component';
import { SidebarComponent } from '../../../features/chat/components/sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent],
  template: `
    <div class="app-layout">
      <app-header (toggleSidebar)="toggleSidebar()"></app-header>
      
      <div class="main-container">
        <!-- Sidebar -->
        <aside class="sidebar-placeholder" [class.open]="sidebarOpen()">
          <div class="sidebar-content">
            <app-sidebar></app-sidebar>
          </div>
          <div class="sidebar-backdrop" (click)="toggleSidebar()"></div>
        </aside>

        <!-- Main Content Area -->
        <main class="content-main">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      background-color: var(--white, #fff);
    }
    .main-container {
      display: flex;
      flex: 1;
      overflow: hidden;
      position: relative;
    }
    .sidebar-placeholder {
      width: 280px;
      background-color: var(--gray-100, #F5F5F5);
      border-right: 1px solid var(--gray-200, #E5E5E5);
      transition: transform 0.3s ease;
      z-index: 20;
    }
    .sidebar-content {
      height: 100%;
      width: 280px;
      background-color: var(--gray-100, #F5F5F5);
      position: relative;
      z-index: 21;
    }
    .sidebar-backdrop {
      display: none;
      position: fixed;
      inset: 0;
      background-color: rgba(0,0,0,0.5);
      z-index: 20;
    }
    .content-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      background-color: var(--gray-50, #FAFAFA);
      min-width: 0;
      overflow-y: auto;
    }
    
    @media (max-width: 768px) {
      .sidebar-placeholder {
        position: absolute;
        height: 100%;
        transform: translateX(-100%);
      }
      .sidebar-placeholder.open {
        transform: translateX(0);
      }
      .sidebar-placeholder.open .sidebar-backdrop {
        display: block;
      }
    }
  `]
})
export class MainLayoutComponent {
  sidebarOpen = signal(false);

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }
}
