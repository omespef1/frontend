import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="callback-container">
      <div class="loading-card">
        <div class="spinner"></div>
        <h2>Autenticando...</h2>
        <p>Por favor espera mientras verificamos tus credenciales corporativas.</p>
      </div>
    </div>
  `,
  styles: [`
    .callback-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f4f7f6;
    }
    .loading-card {
      background: white;
      padding: 3rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      text-align: center;
    }
    .spinner {
      border: 4px solid rgba(0, 0, 0, 0.1);
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border-left-color: #e31837; /* KFC Red */
      animation: spin 1s linear infinite;
      margin: 0 auto 1.5rem;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    h2 { margin-bottom: 0.5rem; color: #333; }
    p { color: #666; font-size: 0.9rem; }
  `]
})
export class CallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const refresh = params['refresh'];

      if (token) {
        this.authService.handleCallback(token, refresh);
        this.router.navigate(['/chat']);
      } else {
        // If no token, maybe an error occurred or user went directly to /callback
        this.router.navigate(['/login']);
      }
    });
  }
}
