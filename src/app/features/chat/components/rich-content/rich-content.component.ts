import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RichContentBlock } from '../../../../core/models/rich-content.model';
import { ChartBlockComponent } from './chart-block/chart-block.component';
import { KpiCardsComponent } from './kpi-cards/kpi-cards.component';
import { DataTableComponent } from './data-table/data-table.component';
import { ExpandModalComponent } from './expand-modal/expand-modal.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-rich-content',
  standalone: true,
  imports: [
    CommonModule, 
    ChartBlockComponent, 
    KpiCardsComponent, 
    DataTableComponent, 
    ExpandModalComponent,
    IconComponent
  ],
  template: `
    <div class="rich-content-blocks" *ngIf="blocks && blocks.length > 0">
      <div class="block-wrapper" *ngFor="let block of blocks; let i = index">
        
        <!-- Expand Button -->
        <button class="expand-btn" (click)="openModal(i)" title="Expandir">
          <app-icon name="expand" size="18"></app-icon>
        </button>

        <ng-container [ngSwitch]="block.type">
          <app-chart-block *ngSwitchCase="'chart'" [block]="$any(block)"></app-chart-block>
          <app-kpi-cards *ngSwitchCase="'kpi'" [block]="$any(block)"></app-kpi-cards>
          <app-data-table *ngSwitchCase="'data_table'" [block]="$any(block)"></app-data-table>
        </ng-container>

      </div>
    </div>

    <!-- Expand Modals -->
    <app-expand-modal 
      *ngFor="let block of blocks; let i = index" 
      [isOpen]="expandedIndex === i"
      (close)="expandedIndex = null">
      
      <ng-container [ngSwitch]="block.type">
        <app-chart-block *ngSwitchCase="'chart'" [block]="$any(block)"></app-chart-block>
        <app-kpi-cards *ngSwitchCase="'kpi'" [block]="$any(block)"></app-kpi-cards>
        <app-data-table *ngSwitchCase="'data_table'" [block]="$any(block)"></app-data-table>
      </ng-container>
      
    </app-expand-modal>
  `,
  styles: [`
    .rich-content-blocks {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-top: 1rem;
    }
    .block-wrapper {
      position: relative;
    }
    .expand-btn {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: var(--white, #fff);
      border: 1px solid var(--gray-200, #E5E5E5);
      border-radius: 4px;
      padding: 0.25rem;
      color: var(--gray-500, #737373);
      cursor: pointer;
      z-index: 10;
      opacity: 0;
      transition: opacity 0.2s;
    }
    .block-wrapper:hover .expand-btn {
      opacity: 1;
    }
    .expand-btn:hover {
      background: var(--gray-50, #FAFAFA);
      color: var(--gray-900, #1A1A1A);
    }
  `]
})
export class RichContentComponent {
  @Input() blocks?: RichContentBlock[];
  expandedIndex: number | null = null;

  openModal(index: number) {
    this.expandedIndex = index;
  }
}
