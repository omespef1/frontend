import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'callback',
    loadComponent: () => import('./features/callback/callback.component').then(m => m.CallbackComponent)
  },
  {
    path: '',
    loadComponent: () => import('./core/layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'chat',
        loadComponent: () => import('./features/chat/chat.component').then(m => m.ChatComponent)
      },
      {
        path: 'documents',
        loadComponent: () => import('./features/document-management/document-management.component').then(m => m.DocumentManagementComponent),
        canActivate: [roleGuard('Supervisor')]
      },
      {
        path: 'quarantine',
        loadComponent: () => import('./features/quarantine/quarantine.component').then(m => m.QuarantineComponent),
        canActivate: [roleGuard('SecAdmin')]
      },
      { path: '', redirectTo: 'chat', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
