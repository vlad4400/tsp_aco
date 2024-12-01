import { Test, TestingModule } from '@nestjs/testing';
import { Tsplib95Service } from './tsplib95.service';

describe('Tsplib95Service', () => {
  let service: Tsplib95Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Tsplib95Service],
    }).compile();

    service = module.get<Tsplib95Service>(Tsplib95Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
