import { Test, TestingModule } from '@nestjs/testing';
import { FightingService } from './fighting.service';

describe('FightingService', () => {
  let service: FightingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FightingService],
    }).compile();

    service = module.get<FightingService>(FightingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
