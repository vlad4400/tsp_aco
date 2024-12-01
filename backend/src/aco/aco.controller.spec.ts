import { Test, TestingModule } from '@nestjs/testing';
import { AcoController } from './aco.controller';

describe('AcoController', () => {
  let controller: AcoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AcoController],
    }).compile();

    controller = module.get<AcoController>(AcoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
