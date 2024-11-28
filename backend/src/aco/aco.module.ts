import { Module } from '@nestjs/common';
import { AcoController } from './aco.controller';
import { SseService } from './services/sse/sse.service';

@Module({
  providers: [SseService],
  controllers: [AcoController]
})
export class AcoModule { }
