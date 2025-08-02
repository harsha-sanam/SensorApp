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
  ngAfterViewInit(): void {
  const canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

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

  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseleave', stopDrawing);

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


}
