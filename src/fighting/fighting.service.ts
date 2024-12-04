import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FightingRepository } from './fighting.repository';
import { Fighting } from './schemas/fighting.schema';
import {
  ATTACKER,
  AttackOutcome,
  CatchOutcome,
  FightStatus,
  FightStatusFinished,
  MAX_CATCH_ATTEMPTS,
} from './constants';
import { PokemonsService } from 'src/pokemons/pokemons.service';
import { AttackDto } from './dtos/Attack.dto';
import {
  attemptCatch,
  calculateAttack,
  getAttackerId,
  getDefenderHpKey,
} from './utils';
import { SwitchPokemonDto } from './dtos/SwitchPokeomn.dto';

@Injectable()
export class FightingService {
  constructor(
    private readonly fightingRepository: FightingRepository,
    private readonly pokemonService: PokemonsService,
  ) {}

  async create() {
    const pcPokemon = await this.pokemonService.getRandomOpponent();
    if (!pcPokemon) {
      throw new NotFoundException('couldnt get an opponent pokemon');
    }
    const userPokemons = await this.pokemonService.getFilteredPokemons({
      isOwned: true,
    });
    if (!userPokemons.total) {
      throw new NotFoundException('user doesnt have pokemons');
    }
    const userPokemonsId = [];
    for (const pokemon of userPokemons.data) {
      userPokemonsId.push({ pokemonId: pokemon._id, hp: pokemon.hp });
    }

    const data: Partial<Fighting> = {
      pcPokemonId: pcPokemon._id,
      pcPokemonHP: pcPokemon.hp,
      userPokemons: userPokemonsId,
      currentActivePokemonId: userPokemonsId[0].pokemonId,
      currentActivePokemonHP: userPokemonsId[0].hp,
      status: FightStatus.PRE_FIGHT,
      catchAttempts: MAX_CATCH_ATTEMPTS,
    };

    const fight =  await this.fightingRepository.create(data);
    const aggregatedFightData = await this.fightingRepository.getCurrentFightData(fight._id);
    return aggregatedFightData;
  }

  async findAll(): Promise<Fighting[]> {
    return this.fightingRepository.findAll();
  }

  async findOne(id: string): Promise<Fighting> {
    const fighting = await this.fightingRepository.findOne(id);
    return fighting;
  }

  async processAttack(
    fightId: string,
    attackDto: AttackDto,
  ): Promise<{ fight: Fighting; outcome: AttackOutcome; damageDealt: number }> {
    const { attacker: attackerIdentifier } = attackDto;

    const currBattle = await this.fightingRepository.findOne(fightId);
    if (!currBattle) {
      throw new NotFoundException(`Battle with ID ${fightId} not found`);
    }
    if (FightStatusFinished.includes(currBattle.status)) {
      throw new BadRequestException(`Battle with ID ${fightId} is not ongoing`);
    }
    //get attacker/defender based on attacker identifier input
    const attackerId = getAttackerId(
      attackerIdentifier === ATTACKER.PC,
      currBattle,
    );
    const defenderId = getAttackerId(
      attackerIdentifier === ATTACKER.USER,
      currBattle,
    );

    const attacker = await this.pokemonService.findById(attackerId);
    const defender = await this.pokemonService.findById(defenderId);

    if (!attacker || !defender) {
      throw new NotFoundException(`couldnt retrive attacker or defender`);
    }

    const defenderHpKey = getDefenderHpKey(attackerIdentifier);
    const defenderCurrentHp =
      attackerIdentifier === ATTACKER.USER
        ? currBattle.pcPokemonHP
        : currBattle.currentActivePokemonHP;

    const newDefenderHp = calculateAttack(
      attacker,
      defender,
      defenderCurrentHp,
    );
    //set outputs based on attack results
    const damageDealt = defenderCurrentHp - newDefenderHp;
    const attackOutcome =
      damageDealt > 0 ? AttackOutcome.SUCCESSFUL : AttackOutcome.MISSED;

    const updates: Partial<Fighting> = { [defenderHpKey]: newDefenderHp };
    if (newDefenderHp === 0) {
      attackerIdentifier === ATTACKER.USER
        ? (updates.status = FightStatus.WON)
        : (updates.status = FightStatus.LOST);
    } else {
      updates.status = FightStatus.IN_FIGHT;
    }
    const updatedFight = await this.fightingRepository.update(fightId, updates);

    return {
      fight: updatedFight,
      outcome: attackOutcome,
      damageDealt: damageDealt,
    };
  }

  async processCatch(
    fightId: string,
  ): Promise<{ fight: Fighting; outcome: CatchOutcome }> {
    const currBattle = await this.fightingRepository.findOne(fightId);
    if (!currBattle) {
      throw new NotFoundException(`Fight with ID ${fightId} not found`);
    }
    if (FightStatusFinished.includes(currBattle.status)) {
      throw new BadRequestException(`Fight with ID ${fightId} is not ongoing`);
    }

    const pcPokemon = await this.pokemonService.findById(
      currBattle.pcPokemonId,
    );
    if (!pcPokemon) {
      throw new NotFoundException(`Couldnt get pc pokemon`);
    }

    const isCatchSuccessful = attemptCatch(
      currBattle.pcPokemonHP,
      pcPokemon.hp,
    );
    let catchOutcome;

    const updates: Partial<Fighting> = {
      ['catchAttempts']: currBattle.catchAttempts - 1,
    };

    if (isCatchSuccessful) {
      await this.pokemonService.setOwned(currBattle.pcPokemonId);
      catchOutcome = CatchOutcome.CAUGHT;
      updates.status = FightStatus.CAUGHT;
    } else if (currBattle.catchAttempts - 1 === 0) {
      updates.status = FightStatus.FLED;
      catchOutcome = CatchOutcome.FLED;
    } else {
      catchOutcome = CatchOutcome.MISSED;
    }

    const updatedFight = await this.fightingRepository.update(fightId, updates);

    return { fight: updatedFight, outcome: catchOutcome };
  }

  async switchActivePokemon(
    fightId: string,
    switchPokemonDto: SwitchPokemonDto,
  ): Promise<Fighting> {
    const { newPokemonId } = switchPokemonDto;

    const currBattle = await this.fightingRepository.findOne(fightId);
    if (!currBattle) {
      throw new NotFoundException(`Fight with ID ${fightId} not found`);
    }
    if (FightStatusFinished.includes(currBattle.status)) {
      throw new BadRequestException(`Fight with ID ${fightId} is not ongoing`);
    }

    const pokemonToSwitchTo = currBattle.userPokemons.find(
      (p) => p.pokemonId.equals(newPokemonId),
    );
    if (!pokemonToSwitchTo) {
      throw new BadRequestException(
        `pokemon with id ${newPokemonId} is not one of the users pokemons`,
      );
    }

    const currPokemonId = currBattle.currentActivePokemonId;
    const currPokemonHp = currBattle.currentActivePokemonHP;

    currBattle.userPokemons = currBattle.userPokemons.map((p) => {
      if (p.pokemonId.equals(currPokemonId)) {
        return { ...p, hp: currPokemonHp };
      }
      return p;
    });

    currBattle.currentActivePokemonId = pokemonToSwitchTo.pokemonId;
    currBattle.currentActivePokemonHP = pokemonToSwitchTo.hp;

    return await this.fightingRepository.update(fightId, currBattle);
  }
}
