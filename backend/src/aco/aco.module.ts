import { Module } from '@nestjs/common';
import { AcoController } from './aco.controller';
import { SseService } from './services/sse/sse.service';
import { Tsplib95Service } from './repositories/tsplib95/tsplib95.service';
import { AcoService } from './services/aco/aco.service';

@Module({
  providers: [SseService, Tsplib95Service, AcoService],
  controllers: [AcoController]
})
export class AcoModule { }
