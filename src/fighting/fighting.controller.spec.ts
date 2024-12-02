import { Test, TestingModule } from '@nestjs/testing';
import { FightingController } from './fighting.controller';
import { FightingService } from './fighting.service';

describe('FightingController', () => {
  let controller: FightingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FightingController],
      providers: [FightingService],
    }).compile();

    controller = module.get<FightingController>(FightingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
