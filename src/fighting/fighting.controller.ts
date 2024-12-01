import { Controller, Get, Post, Body, Param, Logger } from '@nestjs/common';
import { FightingService } from './fighting.service';
import { AttackDto, CatchDto, CreateFightingDto } from './dtos/fighting.dto';
import { Fighting } from './schemas/fighting.schema';
import { AttackOutcome, CatchOutcome } from './constants';

@Controller('fighting')
export class FightingController {
  constructor(private readonly fightingService: FightingService) {}

  @Post()
  async create(): Promise<Fighting> {
    Logger.log('Creating a new fight');
    try {  
      const fight = await this.fightingService.create();
      Logger.log(`Successfully created fight ${fight.id}`);
      return fight;
    } catch (error) {
      Logger.error('Could not create fight', error.stack);
      throw error;
    }
  }
}
