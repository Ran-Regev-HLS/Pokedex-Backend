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
  MAX_CATCH_ATTEMPTS,
} from './constants';
import { PokemonsService } from 'src/pokemons/pokemons.service';
import { AttackDto } from './dtos/fighting.dto';
import { calculateAttack } from './utils';

@Injectable()
export class FightingService {
  constructor(
    private readonly fightingRepository: FightingRepository,
    private readonly pokemonService: PokemonsService,
  ) {}

  async create(): Promise<Fighting> {
    const pcPokemon = await this.pokemonService.getRandomOpponent();
    if (!pcPokemon) {
      throw new NotFoundException('couldnt get an opponent pokemon');
    }
    const userPokemons = await this.pokemonService.getFilteredPokemons(
      { isOwned: true },
      {},
      0,
      0,
    );
    if (!userPokemons.total) {
      throw new NotFoundException('user doesnt have pokemons');
    }
    const userPokemonsId = [];
    for (const pokemon of userPokemons.data) {
      userPokemonsId.push({ pokemonId: pokemon.id, hp: pokemon.hp });
    }

    const data: Partial<Fighting> = {
      pcPokemonId: pcPokemon.id,
      pcPokemonHP: pcPokemon.hp,
      userPokemons: userPokemonsId,
      currentActivePokemonId: userPokemonsId[0].pokemonId,
      currentActivePokemonHP: userPokemonsId[0].hp,
      status: FightStatus.PRE_FIGHT,
      catchAttempts: MAX_CATCH_ATTEMPTS,
    };

    return this.fightingRepository.create(data);
  }

  async findAll(): Promise<Fighting[]> {
    return this.fightingRepository.findAll();
  }

  async findOne(id: string): Promise<Fighting> {
    const fighting = await this.fightingRepository.findOne(id);
    if (!fighting) {
      throw new NotFoundException(`Fighting with ID ${id} not found`);
    }
    return fighting;
  }

  async processAttack(
    fightId: string,
    attackDto: AttackDto,
  ): Promise<{ fight: Fighting; outcome: AttackOutcome, damageDealt: number}> {
    const { attacker: attackerIdentifier } = attackDto;

    const currBattle = await this.fightingRepository.findOne(fightId);
    if (!currBattle) {
      throw new NotFoundException(`Battle with ID ${fightId} not found`);
    }
    if (currBattle.status === FightStatus.WON || currBattle.status === FightStatus.LOST) {
      throw new BadRequestException(`Battle with ID ${fightId} is not ongoing`);
    }
    const attackerId =
      attackerIdentifier === ATTACKER.PC
        ? currBattle.pcPokemonId
        : currBattle.currentActivePokemonId;
    const defenderId =
      attackerIdentifier === ATTACKER.USER
        ? currBattle.pcPokemonId
        : currBattle.currentActivePokemonId;
    const attacker = await this.pokemonService.findById(attackerId);
    const defender = await this.pokemonService.findById(defenderId);

    if (!attacker || !defender) {
      throw new NotFoundException(`couldnt retrive attacker or defender`);
    }

    const defenderHpKey: keyof Fighting =
      attackerIdentifier === ATTACKER.USER
        ? 'pcPokemonHP'
        : 'currentActivePokemonHP';
    const defenderCurrentHp =
      attackerIdentifier === ATTACKER.USER
        ? currBattle.pcPokemonHP
        : currBattle.currentActivePokemonHP;

    const newDefenderHp = calculateAttack(
      attacker,
      defender,
      defenderCurrentHp,
    );
    const damageDealt = defenderCurrentHp - newDefenderHp;
    const attackOutcome =
        damageDealt>0
        ? AttackOutcome.SUCCESSFUL
        : AttackOutcome.MISSED;

    const updates: Partial<Fighting> = { [defenderHpKey]: newDefenderHp };
    if (newDefenderHp === 0) {
      ATTACKER.USER
        ? updates.status = FightStatus.WON
        : updates.status = FightStatus.LOST;
    } else {
      updates.status = FightStatus.IN_FIGHT;
    }
    const updatedFight = await this.fightingRepository.update(fightId, updates);

    return { fight: updatedFight, outcome: attackOutcome, damageDealt: damageDealt };
  }
}
