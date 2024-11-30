import { BadRequestException, Controller, Get, Post, Query, Sse } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { TcpCollection, Tsplib95Service } from './repositories/tsplib95/tsplib95.service';
import { AcoService, SseEvent } from './services/aco/aco.service';

@Controller('api/aco')
export class AcoController {
  constructor(
    private tsplib95Service: Tsplib95Service,
    private acoService: AcoService,
  ) { }

  @Sse('events')
  getShortestPathUpdates(): Observable<{ data: SseEvent }> {
    return this.acoService.getShortestPathUpdates().pipe(
      map((update) => ({ data: update }))
    );
  }

  @Get('cities')
  getCities(@Query('collection') collection: TcpCollection) {
    if (!collection) {
      throw new BadRequestException('Query parameter "collection" is required.');
    }

    switch (collection) {
      case 'berlin52':
        return this.tsplib95Service.getBerlin52();
      case 'att48':
        return this.tsplib95Service.getAttr48();
      default:
        throw new BadRequestException(`Invalid type "${collection}". Allowed values are "berlin52" or "att48".`);
    }
  }

  @Post('start')
  startAlgorithm(@Query('collection') collection: TcpCollection) {
    if (!collection) {
      throw new BadRequestException('Query parameter "collection" is required.');
    }

    let cities;
    switch (collection) {
      case 'berlin52':
        cities = this.tsplib95Service.getBerlin52();
        break;
      case 'att48':
        cities = this.tsplib95Service.getAttr48();
        break;
      default:
        throw new BadRequestException(
          `Invalid type "${collection}". Allowed values are "berlin52" or "att48".`
        );
    }

    this.acoService.startAlgorithm(cities);
  }

  @Post('stop')
  stopAlgorithm() {
    this.acoService.stopAlgorithm();
  }
}
