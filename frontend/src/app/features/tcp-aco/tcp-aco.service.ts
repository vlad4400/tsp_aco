import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urlAPI } from '../../app.config';
import { SseEvent, SseService } from './services/sse.service';
import { City, TcpCollection } from './repositories/tcplib95.service';
import { Observable } from 'rxjs';

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

  getCities(collection: TcpCollection): Observable<City[]> {
    return this.http.get<City[]>(`${this.baseUrl}/cities?collection=${collection}`);
  }

  startAlgorithm(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/start/`, {});
  }

  stopAlgorithm(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/stop/`, {});
  }
}
