import { Component, signal, Input, WritableSignal, ViewChild, ElementRef, effect } from '@angular/core';
import * as d3 from 'd3';
import { City } from '../../repositories/tcplib95.service';

@Component({
  selector: 'app-cities',
  standalone: true,
  imports: [],
  template: `
    <div #chart></div>
  `,
  styles: [
    
  ],
})
export class CitiesComponent {
  cities = signal<City[]>([]);

  @ViewChild('chart') chartContainer!: ElementRef;

  @Input({ alias: 'cities', transform: (value: City[]) => signal(value) })
  set inputCities(value: WritableSignal<City[]>) {
    this.cities.set(value());
  }

  constructor() {
    effect(() => {
      const updatedCities = this.cities();
      if (updatedCities.length) {
        this.updateChart(updatedCities);
      }
    });
  }

  private updateChart(cities: City[]): void {
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
      .domain([0, d3.max(cities, d => d.x) ?? 0])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(cities, d => d.y) ?? 0])
      .range([height, 0]);

    const circles = svg.selectAll('circle')
      .data(cities)
      .enter()
      .append('circle')
      .attr('cx', (d, i) => xScale(d.x))
      .attr('cy', (d, i) => yScale(d.y))
      .attr('r', 5)
      .attr('fill', 'darkblue')
      .attr('opacity', 0.8);

    const labels = svg.selectAll('text')
      .data(cities)
      .enter()
      .append('text')
      .attr('x', (d, i) => xScale(d.x) + 8)
      .attr('y', (d, i) => yScale(d.y))
      .attr('font-size', '12px')
      .attr('fill', 'black')
      .text((d, i) => i + 1); // Point names
  }
}
