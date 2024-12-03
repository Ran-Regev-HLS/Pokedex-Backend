import { Controller, Post, Param, Logger, Query, Body } from '@nestjs/common';
import { FightingService } from './fighting.service';
import { Fighting } from './schemas/fighting.schema';
import { AttackOutcome, CatchOutcome } from './constants';
import { AttackDto } from './dtos/Attack.dto';
import { ObjectId } from 'mongoose';
import { SwitchPokemonDto } from './dtos/SwitchPokeomn.dto';

@Controller('fighting')
export class FightingController {
  constructor(private readonly fightingService: FightingService) {}

  @Post()
  async create(){
    Logger.log('Creating a new fight');
    try {  
      const fight = await this.fightingService.create();
      Logger.log(`Successfully created fight ${fight}`);
      return fight;
    } catch (error) {
      Logger.error('Could not create fight', error);
      throw new Error(error);
    }
  }

  @Post(':id/attack')
  async attack(
    @Param('id') fightId: string,
    @Body() attack: AttackDto,
  ): Promise<{fight:Fighting, outcome: AttackOutcome}> {
    Logger.log(`Processing attack for fight ${fightId}`)
    try {
      const fight = await this.fightingService.processAttack(fightId,attack);
      Logger.log(`Successfully calculated attack with result ${fight.outcome}`)
      return fight;
    } catch (error) {
      Logger.error('Could not calculate attack', error);
      throw new Error(error);
    }
  }

  @Post(':id/catch')
  async catch(
    @Param('id') fightId: string,
  ): Promise<{fight:Fighting, outcome: CatchOutcome}> {
    Logger.log(`Processing catch for fight ${fightId}`)
    try {
      const fight = await this.fightingService.processCatch(fightId);
      Logger.log(`Successfully calculated catch with result ${fight.outcome}`)
      return fight;
    } catch (error) {
      Logger.error('Could not calculate catch', error.stack);
    } 
  }

  @Post(':id/switch-pokemon')
  async switchPokemon(
    @Param('id') fightId: string,
    @Body() switchPokemonDto: SwitchPokemonDto,
  ): Promise<Fighting> {
    Logger.log(`Switching active pokmon in fight ${fightId}`);
    try {
      const updatedFight = await this.fightingService.switchActivePokemon(fightId, switchPokemonDto);
      Logger.log(`Successfully switched pokemon for fight ${fightId}`);
      return updatedFight;
    } catch (error) {
      Logger.error('Could not switch active pokemon', error.stack);
      throw error;
    }
  }

}
