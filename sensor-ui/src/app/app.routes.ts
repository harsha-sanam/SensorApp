import { Routes, provideRouter } from '@angular/router';
import { SensorListComponent } from './sensor-list/sensor-list.component';
import { SensorDrawComponent } from './sensor-draw/sensor-draw.component';
import { SensorGraphComponent } from './sensor-graph/sensor-graph.component';

export const routes: Routes = [
     { path: 'sensors', component: SensorListComponent },
  { path: 'graph', component: SensorGraphComponent },
  { path: 'draw', component: SensorDrawComponent },
  { path: '', redirectTo: '/sensors', pathMatch: 'full' }
];

export const appRouterProviders = [
  provideRouter(routes)
];
