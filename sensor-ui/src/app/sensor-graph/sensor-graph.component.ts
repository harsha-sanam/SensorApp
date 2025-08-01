import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BaseChartDirective } from 'ng2-charts';
import { environment } from '../../../environment';

@Component({
  selector: 'app-sensor-graph',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './sensor-graph.component.html'
})
export class SensorGraphComponent {
  sensors: any[] = [];
  selectedSensor = '';
  start = '';
  end = '';
  chartData = [{ data: [] as number[], label: 'Sensor Value' }];
  chartLabels: string[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<any[]>(`${environment.apiUrl}/sensors`).subscribe(data => this.sensors = data);
  }

  loadData() {
    const url = `${environment.apiUrl}/sensorvalues?name=${this.selectedSensor}&startDate=${this.start}&endDate=${this.end}`;
    this.http.get<any[]>(url).subscribe(data => {
      // Sort by timestamp (ascending)
      const sorted = data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      // Extract chart data and labels
      this.chartData[0].data = sorted.map(v => v.value);
      this.chartLabels = sorted.map(v => new Date(v.timestamp).toLocaleString());
    });

  }
}
