import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';

type SseEvent = {
    type: 'aco-start' | 'aco-stop',
    message: string;
}

@Injectable()
export class SseService {
    private eventSubject = new Subject<SseEvent>();

    emitEvent(data: SseEvent) {
        this.eventSubject.next(data);
    }

    getEvents(): Observable<SseEvent> {
        return this.eventSubject.asObservable();
    }
}
