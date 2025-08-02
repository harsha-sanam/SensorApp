import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
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
export class SensorDrawComponent implements AfterViewInit, OnInit {
  @ViewChild('drawCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;
  isDrawing = false;
  path: { x: number; y: number }[] = [];
  sensors: any[] = [];
  selectedSensorId = 0;
  start = '';
  end = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>(`${environment.apiUrl}/sensors`).subscribe(data => {
      this.sensors = data;
    });
  }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    this.ctx = ctx;

    const getCoordinates = (e: MouseEvent | TouchEvent): { x: number; y: number } => {
      const rect = canvas.getBoundingClientRect();
      if (e instanceof TouchEvent && e.touches.length > 0) {
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top
        };
      } else if (e instanceof MouseEvent) {
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
      }
      return { x: 0, y: 0 };
    };

    const startDrawing = (e: MouseEvent | TouchEvent): void => {
      this.isDrawing = true;
      const { x, y } = getCoordinates(e);
      this.path = [{ x, y }];
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const draw = (e: MouseEvent | TouchEvent): void => {
      if (!this.isDrawing) return;
      const { x, y } = getCoordinates(e);
      this.path.push({ x, y });
      ctx.lineTo(x, y);
      ctx.stroke();
    };

    const stopDrawing = (): void => {
      this.isDrawing = false;
    };

    // Mouse events
    canvas.addEventListener('mousedown', (e: MouseEvent) => startDrawing(e));
    canvas.addEventListener('mousemove', (e: MouseEvent) => draw(e));
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    // Touch events
    canvas.addEventListener('touchstart', (e: TouchEvent) => {
      e.preventDefault();
      startDrawing(e);
    }, { passive: false });

    canvas.addEventListener('touchmove', (e: TouchEvent) => {
      e.preventDefault();
      draw(e);
    }, { passive: false });

    canvas.addEventListener('touchend', (e: TouchEvent) => {
      e.preventDefault();
      stopDrawing();
    });
  }
  
  saveDrawing(): void {
  if (!this.path.length || !this.selectedSensorId || !this.start || !this.end) {
    alert('Please draw and select sensor, start, and end time.');
    return;
  }

  const startTime = new Date(this.start).getTime();
  const endTime = new Date(this.end).getTime();
  const duration = endTime - startTime;

  const payload = this.path.map(p => ({
    timestamp: new Date(startTime + (p.x / 400) * duration).toISOString(),
    value: (300 - p.y) / 5, // example mapping y to value
    sensorId: this.selectedSensorId
  }));

  this.http.post(`${environment.apiUrl}/sensorvalues`, payload).subscribe(() => {
    alert('Saved!');
  });
}

}
