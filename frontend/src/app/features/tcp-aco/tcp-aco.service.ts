import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urlAPI } from '../../app.config';
import { SseEvent, SseService } from './services/sse.service';

@Injectable({
  providedIn: 'root'
})
export class TcpAcoService {
  events: SseEvent[] = [];

  private baseUrl = `${urlAPI}/aco`;

  constructor(private http: HttpClient, private sseService: SseService) {

    const url = `${this.baseUrl}/events`;

    this.sseService.getServerSentEvent(url).subscribe({
      next: (data) => {
        this.events.push(data);
      },
      error: (err) => console.error('SSE error:', err),
      complete: () => console.warn('SSE connection closed'),
    });
  }

  startAlgorithm() {
    return this.http.post(`${this.baseUrl}/start/`, {});
  }

  stopAlgorithm() {
    return this.http.post(`${this.baseUrl}/stop/`, {});
  }
}
