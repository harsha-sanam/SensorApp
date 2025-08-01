import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';

@Component({
  selector: 'app-sensor-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sensor-list.component.html'
})
export class SensorListComponent {
  sensors: any[] = [];
  newSensor = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>(`${environment.apiUrl}/sensors`).subscribe(data => this.sensors = data);
  }

  addSensor() {
    if (!this.newSensor) return;
    this.http.post(`${environment.apiUrl}/sensors`, { name: this.newSensor }).subscribe(() => {
      this.newSensor = '';
      this.ngOnInit();
    });
  }
}
