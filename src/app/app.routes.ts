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
    path: 'chat',
    loadComponent: () => import('./features/chat/chat.component').then(m => m.ChatComponent),
    canActivate: [authGuard]
  },
  {
    path: 'documents',
    loadComponent: () => import('./features/document-management/document-management.component').then(m => m.DocumentManagementComponent),
    canActivate: [authGuard, roleGuard('Supervisor')]
  },
  {
    path: 'quarantine',
    loadComponent: () => import('./features/quarantine/quarantine.component').then(m => m.QuarantineComponent),
    canActivate: [authGuard, roleGuard('SecAdmin')]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
