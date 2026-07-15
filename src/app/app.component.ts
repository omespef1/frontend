import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';
import { GlobalProgressComponent } from './shared/components/global-progress/global-progress.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent, GlobalProgressComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'kfc-chat-frontend';
}
