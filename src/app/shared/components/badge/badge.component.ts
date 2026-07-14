import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" [ngClass]="colorClass">
      <ng-content></ng-content>
    </span>
  `,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.625rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }
    .badge-red {
      background-color: #FDE8EC;
      color: #C8001F;
    }
    .badge-gray {
      background-color: #E5E5E5;
      color: #404040;
    }
    .badge-green {
      background-color: #D1E7DD;
      color: #0F5132;
    }
    .badge-yellow {
      background-color: #FFF3CD;
      color: #664D03;
    }
  `]
})
export class BadgeComponent {
  @Input() color: 'red' | 'gray' | 'green' | 'yellow' = 'red';
  
  get colorClass() {
    return `badge-${this.color}`;
  }
}
