import { Module } from '@nestjs/common';
import { AcoController } from './aco.controller';
import { SseService } from './services/sse/sse.service';
import { Tsplib95Service } from './repositories/tsplib95/tsplib95.service';

@Module({
  providers: [SseService, Tsplib95Service],
  controllers: [AcoController]
})
export class AcoModule { }
