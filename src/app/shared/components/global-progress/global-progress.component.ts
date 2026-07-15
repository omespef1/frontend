import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalProgressService } from '../../../core/services/global-progress.service';

@Component({
  selector: 'app-global-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './global-progress.component.html',
  styleUrls: ['./global-progress.component.scss']
})
export class GlobalProgressComponent {
  progressService = inject(GlobalProgressService);
}
