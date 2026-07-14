import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="avatar" [ngClass]="[sizeClass, bgColorClass]" [title]="name">
      <ng-container *ngIf="src; else textInitials">
        <img [src]="src" [alt]="name" class="avatar-img" />
      </ng-container>
      <ng-template #textInitials>
        <span class="avatar-text">{{ initials }}</span>
      </ng-template>
    </div>
  `,
  styles: [`
    .avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 9999px;
      overflow: hidden;
      flex-shrink: 0;
    }
    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .avatar-text {
      color: white;
      font-weight: 600;
      letter-spacing: 0.05em;
    }
    
    /* Sizes */
    .avatar-sm { width: 32px; height: 32px; font-size: 0.75rem; }
    .avatar-md { width: 40px; height: 40px; font-size: 1rem; }
    .avatar-lg { width: 64px; height: 64px; font-size: 1.5rem; }
    
    /* BG Colors */
    .bg-red { background-color: #E4002B; }
    .bg-gray { background-color: #737373; }
  `]
})
export class AvatarComponent {
  @Input() name = '';
  @Input() src?: string;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() bgColor: 'red' | 'gray' = 'gray';

  get sizeClass() { return `avatar-${this.size}`; }
  get bgColorClass() { return `bg-${this.bgColor}`; }
  
  get initials() {
    if (!this.name) return '?';
    const parts = this.name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  }
}
