import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Source } from '../../../../../core/models/message.model';
import { IconComponent } from '../../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-source-chips',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="sources-container" *ngIf="sources && sources.length > 0">
      <div class="sources-label">Fuentes:</div>
      <div class="chips-list">
        <a 
          class="source-chip" 
          *ngFor="let source of sources"
          [href]="source.url || '#'"
          target="_blank"
          (click)="handleClick($event, source)">
          <app-icon name="document" size="14"></app-icon>
          <span>{{ source.name }}</span>
          <span class="section" *ngIf="source.section">— Sec. {{ source.section }}</span>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .sources-container {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--gray-200, #E5E5E5);
    }
    .sources-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--gray-500, #737373);
      text-transform: uppercase;
    }
    .chips-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .source-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.25rem 0.625rem;
      background-color: var(--gray-100, #F5F5F5);
      border: 1px solid var(--gray-200, #E5E5E5);
      border-radius: 9999px;
      font-size: 0.75rem;
      color: var(--gray-700, #404040);
      text-decoration: none;
      transition: all 0.2s;
      cursor: pointer;
    }
    .source-chip:hover {
      background-color: var(--kfc-red-light, #FDE8EC);
      border-color: var(--kfc-red-light, #FDE8EC);
      color: var(--kfc-red-dark, #C8001F);
    }
    .section {
      color: var(--gray-500, #737373);
    }
    .source-chip:hover .section {
      color: inherit;
    }
  `]
})
export class SourceChipsComponent {
  @Input() sources?: Source[];

  handleClick(event: Event, source: Source) {
    if (!source.url) {
      event.preventDefault();
    }
  }
}
