import { Injectable, effect, signal } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket!: WebSocket;
  messages = signal<any[]>([]);

  get messages$() {
    return this.socket;
  }

  constructor() {
    this.connect();
  }

  private connect() {
    this.socket = new WebSocket('ws://localhost:8000/ws/notifications/');

    this.socket.onopen = () => {
      console.log('WebSocket connected');
    };

    this.socket.onmessage = (event) => {
      console.log('onMessage', event);
      
      const data = JSON.parse(event.data);
      this.messages.update((messages) => [...messages, data]);
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected, reconnecting...');
      setTimeout(() => this.connect(), 5000);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  sendMessage(msg: any) {
    this.socket.send(JSON.stringify(msg));
  }
}
