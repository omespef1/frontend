import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      [attr.width]="size" 
      [attr.height]="size" 
      [attr.viewBox]="viewBox" 
      [attr.fill]="fill"
      [attr.stroke]="stroke"
      [attr.stroke-width]="strokeWidth"
      [attr.stroke-linecap]="'round'"
      [attr.stroke-linejoin]="'round'"
      class="icon"
      [ngClass]="class">
      
      <!-- Bot -->
      <g *ngIf="name === 'bot'">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M4 21v-13a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-9l-4 4" />
        <path d="M9.5 9h.01" />
        <path d="M14.5 9h.01" />
        <path d="M9.5 13a3.5 3.5 0 0 0 5 0" />
      </g>
      
      <!-- Send -->
      <g *ngIf="name === 'send'">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M10 14l11 -11" />
        <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
      </g>
      
      <!-- Upload -->
      <g *ngIf="name === 'upload'">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
        <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
        <path d="M12 11v6" />
        <path d="M9.5 13.5l2.5 -2.5l2.5 2.5" />
      </g>
      
      <!-- Document -->
      <g *ngIf="name === 'document'">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
        <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
        <path d="M9 9h1" />
        <path d="M9 13h6" />
        <path d="M9 17h6" />
      </g>
      
      <!-- Plus -->
      <g *ngIf="name === 'plus'">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 5l0 14" />
        <path d="M5 12l14 0" />
      </g>
      
      <!-- Menu -->
      <g *ngIf="name === 'menu'">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M4 6l16 0" />
        <path d="M4 12l16 0" />
        <path d="M4 18l16 0" />
      </g>
      
      <!-- Expand -->
      <g *ngIf="name === 'expand'">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M4 8v-2a2 2 0 0 1 2 -2h2" />
        <path d="M4 16v2a2 2 0 0 0 2 2h2" />
        <path d="M16 4h2a2 2 0 0 1 2 2v2" />
        <path d="M16 20h2a2 2 0 0 0 2 -2v-2" />
      </g>

      <!-- Logout -->
      <g *ngIf="name === 'logout'">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
        <path d="M9 12h12l-3 -3" />
        <path d="M18 15l3 -3" />
      </g>

      <!-- Trash -->
      <g *ngIf="name === 'trash'">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M4 7l16 0" />
        <path d="M10 11l0 6" />
        <path d="M14 11l0 6" />
        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
      </g>
      
      <!-- Trending Up -->
      <g *ngIf="name === 'trending-up'">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M3 17l6 -6l4 4l8 -8" />
        <path d="M14 7l7 0l0 7" />
      </g>

      <!-- Trending Down -->
      <g *ngIf="name === 'trending-down'">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M3 7l6 6l4 -4l8 8" />
        <path d="M21 10l0 7l-7 0" />
      </g>

      <!-- Close (X) -->
      <g *ngIf="name === 'x' || name === 'close'">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M18 6l-12 12" />
        <path d="M6 6l12 12" />
      </g>

      <!-- Check -->
      <g *ngIf="name === 'check'">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M5 12l5 5l10 -10" />
      </g>
    </svg>
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .icon {
      display: block;
    }
  `]
})
export class IconComponent {
  @Input() name!: string;
  @Input() size: number | string = 24;
  @Input() color?: string;
  @Input() fill = 'none';
  @Input() strokeWidth = 2;
  @Input() class = '';
  
  get stroke() {
    return this.color ? this.color : 'currentColor';
  }
  
  get viewBox() {
    return '0 0 24 24';
  }
}
