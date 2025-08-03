import { Routes, provideRouter } from '@angular/router';
import { SensorListComponent } from './sensor-list/sensor-list.component';
import { SensorDrawComponent } from './sensor-draw/sensor-draw.component';
import { SensorGraphComponent } from './sensor-graph/sensor-graph.component';
import { ChatPopupComponent } from './chat-popup/chat-popup.component';

export const routes: Routes = [
     { path: 'sensors', component: SensorListComponent },
  { path: 'graph', component: SensorGraphComponent },
  { path: 'draw', component: SensorDrawComponent },
  { path: 'qqq', component: ChatPopupComponent },
  { path: '', redirectTo: '/sensors', pathMatch: 'full' }
];

export const appRouterProviders = [
  provideRouter(routes)
];
