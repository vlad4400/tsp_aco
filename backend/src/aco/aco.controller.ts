import { Controller, Post, Sse } from '@nestjs/common';
import { MessageEvent } from '@nestjs/common/interfaces';
import { Observable } from 'rxjs';
import { SseService } from './services/sse/sse.service';
import { Tsplib95Service } from './repositories/tsplib95/tsplib95.service';

@Controller('api/aco')
export class AcoController {
  constructor(private readonly sseService: SseService, private tsplib95Service: Tsplib95Service) { }

  @Sse('events')
  sendEvents(): Observable<MessageEvent> {
    // return interval(1000).pipe(map((_) => ({ data: { hello: 'world' } })));

    return new Observable<MessageEvent>((observer) => {
      const subscription = this.sseService.getEvents().subscribe({
        next: (data) => {
          observer.next({
            data,
          });
        },
        error: (err) => {
          observer.error(err);
        },
        complete: () => {
          observer.complete();
        },
      });

      return () => {
        subscription.unsubscribe();
      };
    });
  }

  @Post('start')
  start() {
    this.sseService.emitEvent({ type: 'aco-start', message: 'Start process' });

    return this.tsplib95Service.getBerlin52();
  }

  @Post('stop')
  stop() {
    this.sseService.emitEvent({ type: 'aco-stop', message: 'Stop process' });
  }
}
