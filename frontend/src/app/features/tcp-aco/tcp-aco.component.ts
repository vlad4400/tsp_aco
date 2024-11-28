import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TcpAcoService } from './tcp-aco.service';

@Component({
  selector: 'app-tcp-aco',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button (click)="start()">Start</button>
    <button (click)="stop()">Stop</button>    
  `,
})
export class TcpAcoComponent {

  constructor(private tcpAcoService: TcpAcoService) { }

  start() {
    this.tcpAcoService.startAlgorithm().subscribe({
      next: (data) => {
        console.log('on start:', data)
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
