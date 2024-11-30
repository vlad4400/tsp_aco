import { Test, TestingModule } from '@nestjs/testing';
import { AcoService } from './aco.service';

describe('AcoService', () => {
  let service: AcoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcoService],
    }).compile();

    service = module.get<AcoService>(AcoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
