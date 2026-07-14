import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo-container">
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 28V12H16.5C18.5 12 20 12.5 21 13.5C22 14.5 22.5 16 22.5 18C22.5 20 22 21.5 21 22.5C20 23.5 18.5 24 16.5 24H15V28H12ZM15 21H16.5C17.5 21 18.25 20.75 18.75 20.25C19.25 19.75 19.5 19 19.5 18C19.5 17 19.25 16.25 18.75 15.75C18.25 15.25 17.5 15 16.5 15H15V21Z" fill="white"/>
            </svg>
          </div>
          <h1>Agente de Comedor</h1>
          <p>Inicia sesión corporativa con Hera</p>
        </div>

        <div class="login-actions">
          <button type="button" class="btn-submit" (click)="onLogin()">
            Iniciar Sesión con KFC
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private authService: AuthService) {}

  onLogin() {
    this.authService.startLogin();
  }
}
