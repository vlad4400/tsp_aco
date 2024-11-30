import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { urlAPI } from '../../app.config';
import { City, TcpCollection } from './repositories/tcplib95.service';
import { SseEvent, SseService } from './services/sse.service';

@Injectable({
  providedIn: 'root'
})
export class TcpAcoService {
  public event = signal<SseEvent | null>(null);

  private baseUrl = `${urlAPI}/aco`;

  constructor(private http: HttpClient, private sseService: SseService) {
    this.startListeningForBestPath();
  }

  startListeningForBestPath(): void {
    this.event.set(null);

    const url = `${this.baseUrl}/events`;

    this.sseService.getServerSentEvent(url).subscribe({
      next: (data) => {
        this.event.set(data);
      },
      error: (err) => console.error('SSE error:', err),
      complete: () => console.warn('SSE connection closed'),
    });
  }

  getCities(collection: TcpCollection): Observable<City[]> {
    return this.http.get<City[]>(`${this.baseUrl}/cities?collection=${collection}`);
  }

  startAlgorithm(collection: TcpCollection): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/start?collection=${collection}`, {});
  }

  stopAlgorithm(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/stop/`, {});
  }
}
