import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User, UserRole } from '../models/user.model';
import { environment } from '../../../environments/environment';

export interface AuthResponseDto {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    email: string;
    roles: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = signal<User | null>(null);
  userRole = signal<UserRole | null>(null);
  isAuthenticated = signal<boolean>(false);
  currentMockUser = signal<string>('');

  private tokenKey = 'kfc_era_token';
  private refreshTokenKey = 'kfc_era_refresh_token';

  constructor(private router: Router, private http: HttpClient) {
    this.restoreSession();
  }

  startLogin(): void {
    // BYPASS PILOTO LOCAL: En lugar de redirigir a ERA, generamos un JWT falso de SecAdmin instantáneamente
    const fakeHeader = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const fakePayload = btoa(JSON.stringify({
      sub: 'user-piloto',
      name: 'Administrador Piloto',
      email: 'piloto@kfc.com.ec',
      role: 'SecAdmin',
      permissions: ['SecAdmin']
    }));
    const fakeSignature = 'fake-signature-for-local-pilot';
    const fakeToken = `${fakeHeader}.${fakePayload}.${fakeSignature}`;

    this.handleCallback(fakeToken, 'fake-refresh-token');
    this.router.navigate(['/chat']);
  }

  handleCallback(token: string, refreshToken: string): void {
    sessionStorage.setItem(this.tokenKey, token);
    sessionStorage.setItem(this.refreshTokenKey, refreshToken);
    
    // Decodificar JWT (sin validar firma - eso lo hace el backend)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      const userRole = this.mapRole(payload.role || (payload.roles && payload.roles[0]) || 'Empleado');
      
      const user: User = {
        id: payload.sub || payload.nameid || '',
        name: payload.name || payload.given_name || 'Usuario',
        email: payload.email || payload.preferred_username || '',
        role: userRole,
        permissions: payload.permissions || []
      };
      
      sessionStorage.setItem('kfc_current_user', JSON.stringify(user));
      
      this.currentUser.set(user);
      this.userRole.set(user.role);
      this.isAuthenticated.set(true);
    } catch (e) {
      console.error('Error decoding JWT', e);
      this.logout();
    }
  }

  private mapRole(role: string): UserRole {
    const roleMap: Record<string, UserRole> = {
      'admin': 'SecAdmin', 'secadmin': 'SecAdmin', 'SecAdmin': 'SecAdmin',
      'supervisor': 'Supervisor', 'Supervisor': 'Supervisor',
      'empleado': 'Empleado', 'Empleado': 'Empleado'
    };
    return roleMap[role] || 'Empleado';
  }

  refresh(): Observable<AuthResponseDto> {
    const refreshToken = sessionStorage.getItem(this.refreshTokenKey);
    return this.http.post<AuthResponseDto>(`${environment.apiBaseUrl}/api/v1/auth/refresh`, { refreshToken }).pipe(
      tap(response => {
        sessionStorage.setItem(this.tokenKey, response.token);
        if (response.refreshToken) {
          sessionStorage.setItem(this.refreshTokenKey, response.refreshToken);
        }
      })
    );
  }

  logout() {
    this.currentUser.set(null);
    this.userRole.set(null);
    this.isAuthenticated.set(false);
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.refreshTokenKey);
    sessionStorage.removeItem('kfc_current_user');
    
    // BYPASS PILOTO LOCAL:
    // window.location.href = `${environment.apiBaseUrl}/api/v1/auth/logout`;
    this.router.navigate(['/login']);
  }

  private restoreSession() {
    const token = sessionStorage.getItem(this.tokenKey);
    const userStr = sessionStorage.getItem('kfc_current_user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUser.set(user);
        this.userRole.set(user.role);
        this.isAuthenticated.set(true);
      } catch (e) {
        this.logout();
      }
    }
  }

  hasPermission(permission: string): boolean {
    const user = this.currentUser();
    return user ? user.permissions.includes(permission) : false;
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  /**
   * Permite cambiar el rol activo del usuario sin re-autenticación.
   * Uso temporal mientras HERA no proporcione roles reales.
   */
  switchRole(newRole: UserRole): void {
    this.userRole.set(newRole);
    const user = this.currentUser();
    if (user) {
      const updatedUser = { ...user, role: newRole };
      this.currentUser.set(updatedUser);
      sessionStorage.setItem('kfc_current_user', JSON.stringify(updatedUser));
    }
  }

  setMockUser(email: string): void {
    this.currentMockUser.set(email);
  }
}
