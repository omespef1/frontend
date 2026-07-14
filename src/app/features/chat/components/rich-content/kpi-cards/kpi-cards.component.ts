import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiBlock } from '../../../../../core/models/rich-content.model';
import { IconComponent } from '../../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-kpi-cards',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="kpi-container">
      <div class="kpi-header" *ngIf="block.title">
        <h4>{{ block.title }}</h4>
      </div>
      <div class="kpi-grid">
        <div class="kpi-card" *ngFor="let metric of block.metrics">
          <div class="kpi-label">{{ metric.label }}</div>
          <div class="kpi-value-row">
            <span class="kpi-value">{{ metric.value }}</span>
            <div 
              class="kpi-trend" 
              *ngIf="metric.trend && metric.trendValue"
              [ngClass]="'trend-' + metric.trend">
              <app-icon 
                [name]="metric.trend === 'up' ? 'trending-up' : (metric.trend === 'down' ? 'trending-down' : 'menu')" 
                size="16">
              </app-icon>
              <span>{{ metric.trendValue }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .kpi-container {
      margin: 1rem 0;
    }
    .kpi-header h4 {
      margin: 0 0 1rem 0;
      color: var(--gray-900, #1A1A1A);
      font-size: 1rem;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
    }
    .kpi-card {
      background: var(--white, #fff);
      border: 1px solid var(--gray-200, #E5E5E5);
      border-radius: 8px;
      padding: 1.25rem;
    }
    .kpi-label {
      font-size: 0.875rem;
      color: var(--gray-500, #737373);
      margin-bottom: 0.5rem;
    }
    .kpi-value-row {
      display: flex;
      align-items: baseline;
      gap: 0.75rem;
    }
    .kpi-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--gray-900, #1A1A1A);
    }
    .kpi-trend {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.125rem 0.375rem;
      border-radius: 4px;
    }
    .trend-up {
      background-color: #DCFCE7;
      color: #166534;
    }
    .trend-down {
      background-color: #FEE2E2;
      color: #991B1B;
    }
    .trend-neutral {
      background-color: #F3F4F6;
      color: #4B5563;
    }
  `]
})
export class KpiCardsComponent {
  @Input() block!: KpiBlock;
}
