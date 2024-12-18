import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild, WritableSignal, effect, signal } from '@angular/core';
import * as d3 from 'd3';
import { ProgressBarModule } from 'primeng/progressbar';
import { City } from '../../repositories/tcplib95.service';
import { SseEvent } from '../../services/sse.service';

@Component({
  selector: 'app-cities',
  standalone: true,
  imports: [ProgressBarModule, CommonModule],
  template: `
    <div class="chart-container">
      <div #chart class="chart"></div>
  
      <div class="progress-bar-container">
        @if (loading()) {
            <p-progressBar mode="indeterminate" [style]="{ height: '4px' }" />
        }
      </div>
    </div>

    @if (distance() !== null) {
      <div
        class="status"
        @fadeAnimation
      >
        <p>The best distance found is: <strong>{{ distance() }}</strong></p>
        <p>Discovered during iteration: <strong>{{ interations() }}</strong></p>
      </div>
    }
  `,
  styles: [
    `
      :host {
        .chart-container {
          width: 700px;
          height: 500px;
          background-color: rgb(255, 230, 235, 0.5);
          border-radius: 15px;
          backdrop-filter: blur(10px);
          padding: 20px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

          .progress-bar-container {
            height: 10px;
          }
        }

        .status {
          margin-top: 20px;
          background-color: rgb(255, 230, 235, 0.5);
          border-radius: 15px;
          backdrop-filter: blur(10px);
          padding: 5px 20px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
      }
    `,
  ],
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'scale(1)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({ opacity: 0, transform: 'scale(0.9)' })
        ),
      ]),
    ]),
  ]
})
export class CitiesComponent {
  cities = signal<City[]>([]);
  path = signal<number[]>([]);
  distance = signal<number | null>(null);
  interations = signal<number>(0);
  loading = signal<boolean>(false);

  @ViewChild('chart') chartContainer!: ElementRef;

  @Input({ alias: 'cities', transform: (value: City[]) => signal(value), required: true })
  set inputCities(value: WritableSignal<City[]>) {
    this.cities.set(value());
  }

  @Input({ alias: 'path', transform: (value: SseEvent | null) => signal(value), required: true })
  set inputPath(value: WritableSignal<SseEvent | null>) {
    const sseEvent = value();

    this.path.set(sseEvent ? sseEvent.path : []);
    this.distance.set(sseEvent ? parseFloat(sseEvent.distance.toFixed(2)) : null);
    this.interations.set(sseEvent ? sseEvent.iterationCount : 0);
  }

  @Input({ alias: 'loading', transform: (value: boolean) => signal(value), required: true })
  set inputLoading(value: WritableSignal<boolean>) {
    this.loading.set(value());
  }

  constructor() {
    effect(() => {
      const updatedCities = this.cities();
      const updatedPath = this.path();

      if (updatedCities.length) {
        this.updateChart(updatedCities, updatedPath);
      }
    });
  }

  private updateChart(cities: City[], path: number[]): void {
    if (!this.chartContainer) {
      return;
    }

    const element = this.chartContainer.nativeElement;

    d3.select(element).selectAll('*').remove();

    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    const svg = d3.select(element)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(cities, (d) => d.x) ?? 0])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(cities, (d) => d.y) ?? 0])
      .range([height, 0]);

    // Draw cities as circles
    svg.selectAll('circle')
      .data(cities)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(d.x))
      .attr('cy', (d) => yScale(d.y))
      .attr('r', 3)
      .attr('fill', 'darkblue')
      .attr('opacity', 0.8);

    // Add city labels
    svg.selectAll('text')
      .data(cities)
      .enter()
      .append('text')
      .attr('x', (d) => xScale(d.x) + 8)
      .attr('y', (d) => yScale(d.y))
      .attr('font-size', '10px')
      .attr('fill', 'black')
      .text((_, i) => i + 1);

    // Draw shortest path
    if (path.length > 1) {
      const line = d3.line<City>()
        .x((d) => xScale(d.x))
        .y((d) => yScale(d.y));

      const pathCities = path.map((index) => cities[index]);

      svg.append('path')
        .datum([...pathCities, pathCities[0]]) // Close the loop
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', 'darkblue')
        .attr('stroke-width', 2);
    }
  }
}
