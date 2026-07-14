import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableBlock } from '../../../../../core/models/rich-content.model';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-container">
      <div class="table-header" *ngIf="block.title">
        <h4>{{ block.title }}</h4>
      </div>
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th *ngFor="let header of block.headers">{{ header }}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of block.rows">
              <td *ngFor="let cell of row">{{ cell }}</td>
            </tr>
          </tbody>
          <tfoot *ngIf="block.footer">
            <tr>
              <td [attr.colspan]="block.headers.length">{{ block.footer }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .table-container {
      margin: 1rem 0;
      background: var(--white, #fff);
      border: 1px solid var(--gray-200, #E5E5E5);
      border-radius: 8px;
      overflow: hidden;
    }
    .table-header {
      padding: 1rem 1rem 0;
    }
    .table-header h4 {
      margin: 0;
      color: var(--gray-900, #1A1A1A);
      font-size: 1rem;
    }
    .table-wrapper {
      overflow-x: auto;
      padding: 1rem;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }
    .data-table th, .data-table td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid var(--gray-200, #E5E5E5);
    }
    .data-table th {
      font-weight: 600;
      color: var(--gray-700, #404040);
      background-color: var(--gray-50, #FAFAFA);
    }
    .data-table tbody tr:last-child td {
      border-bottom: none;
    }
    .data-table tfoot td {
      font-size: 0.75rem;
      color: var(--gray-500, #737373);
      padding-top: 1rem;
      border-bottom: none;
    }
  `]
})
export class DataTableComponent {
  @Input() block!: DataTableBlock;
}
