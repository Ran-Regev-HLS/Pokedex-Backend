import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { FightingService } from './fighting.service';
import { AttackDto, CatchDto, CreateFightingDto } from './dtos/fighting.dto';
import { Fighting } from './schemas/fighting.schema';
import { AttackOutcome, CatchOutcome } from './constants';

@Controller('fighting')
export class FightingController {
  constructor(private readonly fightingService: FightingService) {}

  @Post()
  async create(
    @Body() createFightingDto: CreateFightingDto,
  ): Promise<Fighting> {
    return this.fightingService.create(createFightingDto);
  }

  @Post(':id/attack')
  async attack(
    @Param('id') fightId: string,
    @Body() attack: AttackDto,
  ): Promise<{fight:Fighting, outcome: AttackOutcome}> {
    return this.fightingService.processAttack(fightId,attack);
  }

  @Post(':id/catch')
  async catch(
    @Param('id') fightId: string,
    @Body() catchData: CatchDto,
  ): Promise<{fight:Fighting, outcome: CatchOutcome}> {
    return this.fightingService.processCatch(fightId,catchData);
  }
}
