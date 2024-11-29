import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TcpAcoService } from './tcp-aco.service';
import { Tsplib95Service } from './repositories/tcplib95.service';
import { CitiesComponent } from './components/cities/cities.component';

@Component({
  selector: 'app-tcp-aco',
  standalone: true,
  imports: [CommonModule, CitiesComponent],
  template: `
    <app-cities [cities]="tcplib95Service.cities()"></app-cities>
    <button (click)="start()">Start</button>
    <button (click)="stop()">Stop</button>
  `,
  providers: [
    Tsplib95Service,
  ]
})
export class TcpAcoComponent {

  constructor(private tcpAcoService: TcpAcoService, protected tcplib95Service: Tsplib95Service) { }

  start() {
    this.tcpAcoService.startAlgorithm().subscribe({
      next: (cities) => {
        this.tcplib95Service.setBerlin52(cities);
      }
    });
  }

  stop() {
    this.tcpAcoService.stopAlgorithm().subscribe({
      next: (data) => {
        console.log('on stop:', data)
      }
    });
  }
}
