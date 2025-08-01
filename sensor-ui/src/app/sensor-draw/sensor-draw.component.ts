import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';

@Component({
  selector: 'app-sensor-draw',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sensor-draw.component.html'
})
export class SensorDrawComponent implements AfterViewInit {
  @ViewChild('drawCanvas') canvasRef!: ElementRef;
  ctx!: CanvasRenderingContext2D;
  drawing = false;
  points: { x: number; y: number }[] = [];
  sensors: any[] = [];
  selectedSensorId = 0;
  start = '';
  end = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>(`${environment.apiUrl}/sensors`).subscribe(data => this.sensors = data);
  }

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
    this.ctx = canvas.getContext('2d')!;
  }

  startDraw(e: MouseEvent) {
    this.drawing = true;
    this.points = [];
    this.ctx.beginPath();
    this.ctx.moveTo(e.offsetX, e.offsetY);
  }

  draw(e: MouseEvent) {
    if (!this.drawing) return;
    this.ctx.lineTo(e.offsetX, e.offsetY);
    this.ctx.stroke();
    this.points.push({ x: e.offsetX, y: e.offsetY });
  }

  endDraw() {
    this.drawing = false;
  }

  saveDrawing() {
    const startTime = new Date(this.start).getTime();
    const endTime = new Date(this.end).getTime();
    const duration = endTime - startTime;
    const values = this.points.map(p => ({
      timestamp: new Date(startTime + (p.x / 600) * duration).toISOString(),
      value: Number(100 - (p.y / 300) * 100),
      sensorId: Number(this.selectedSensorId)
    }));

    this.http.post(`${environment.apiUrl}/sensorvalues`, values).subscribe();
  }
}
