import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChatPopupComponent } from './chat-popup/chat-popup.component';

@Component({
  selector: 'app-root',
  imports: [RouterModule,ChatPopupComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'sensor-ui';
}
