import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';

export type SseEvent = {
  path: number[];
  distance: number;
  iterationCount: number;
  finish?: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class SseService {
  constructor(
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  getServerSentEvent(url: string): Observable<SseEvent> {
    return new Observable(observer => {
      if (!isPlatformBrowser(this.platformId)) {
        observer.error('EventSource is unavailable outside the browser');
        return;
      }

      const eventSource = new EventSource(url);

      eventSource.onmessage = event => {
        this.zone.run(() => {
          observer.next(JSON.parse(event.data));
        });
      };

      eventSource.onerror = error => {
        this.zone.run(() => {
          if (eventSource.readyState === EventSource.CLOSED) {
            eventSource.close();
            observer.complete();
          } else {
            observer.error('EventSource error');
          }
        });
      };

      return () => {
        eventSource.close();
      };
    });
  }

}
