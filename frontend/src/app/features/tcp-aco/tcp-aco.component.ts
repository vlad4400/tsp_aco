import { Component, inject } from '@angular/core';
import { TcpAcoService } from './tcp-aco.service';
import { WebsocketService } from '../../core/websocket.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tcp-aco',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button (click)="start()">Start</button>
    <button (click)="stop()">Stop</button>    
    <div *ngFor="let message of messages()">
      {{ message }}
    </div>
  `,
  styles: ``
})
export class TcpAcoComponent {
  private readonly websocketService = inject(WebsocketService);

  protected messages = this.websocketService.messages;

  constructor(
    private tcpAcoService: TcpAcoService,
  ) {
    // this.websocketService.messages$.subscribe((message) => {
    //   this.updates.push(message);
    // });
  }

  start() {
    this.tcpAcoService.startAlgorithm().subscribe();
  }

  stop() {
    this.tcpAcoService.stopAlgorithm().subscribe();
  }
}
