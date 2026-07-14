import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty-state">
      <div class="logo-container">
        <!-- KFC Icon -->
        <svg width="64" height="64" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="8" fill="#E4002B"/>
          <path d="M12 28V12H16.5C18.5 12 20 12.5 21 13.5C22 14.5 22.5 16 22.5 18C22.5 20 22 21.5 21 22.5C20 23.5 18.5 24 16.5 24H15V28H12ZM15 21H16.5C17.5 21 18.25 20.75 18.75 20.25C19.25 19.75 19.5 19 19.5 18C19.5 17 19.25 16.25 18.75 15.75C18.25 15.25 17.5 15 16.5 15H15V21Z" fill="white"/>
        </svg>
      </div>
      <h1 class="welcome-title">Hola, {{ authService.currentUser()?.name?.split(' ')?.[0] || 'Equipo' }}</h1>
      <p class="welcome-subtitle">Soy el Agente de Comedor. ¿En qué te puedo ayudar hoy?</p>
      
      <div class="suggestions-grid">
        <button 
          class="suggestion-card" 
          *ngFor="let suggestion of suggestions"
          (click)="onSelectSuggestion.emit(suggestion)">
          {{ suggestion }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
    }
    .logo-container {
      margin-bottom: 1.5rem;
    }
    .welcome-title {
      font-size: 2rem;
      font-weight: 700;
      color: var(--gray-900, #1A1A1A);
      margin-bottom: 0.5rem;
    }
    .welcome-subtitle {
      font-size: 1.125rem;
      color: var(--gray-600, #525252);
      margin-bottom: 2.5rem;
    }
    .suggestions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      width: 100%;
    }
    .suggestion-card {
      background-color: var(--white, #fff);
      border: 1px solid var(--gray-200, #E5E5E5);
      border-radius: 12px;
      padding: 1.25rem;
      font-size: 0.875rem;
      color: var(--gray-700, #404040);
      text-align: left;
      cursor: pointer;
      transition: all 0.2s;
      line-height: 1.5;
    }
    .suggestion-card:hover {
      border-color: var(--kfc-red, #E4002B);
      background-color: var(--kfc-red-light, #FDE8EC);
      color: var(--kfc-red-dark, #C8001F);
      transform: translateY(-2px);
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
    }
  `]
})
export class EmptyStateComponent {
  @Output() onSelectSuggestion = new EventEmitter<string>();

  suggestions = [
    '¿Cuál es el proceso de check-in y autorización para empleados temporales?',
    'Muestra un gráfico con el consumo de comidas de la última semana por planta',
    'Genera un reporte de las autorizaciones denegadas el día de hoy',
    '¿Cuáles son las reglas de gramaje estandarizadas para el menú base?'
  ];

  constructor(public authService: AuthService) {}
}
