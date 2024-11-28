import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AttackDto, CatchDto, CreateFightingDto } from './dtos/fighting.dto';
import { FightingRepository } from './repository/fighting.repository';
import { Fighting } from './schemas/fighting.schema';
import { PokemonRepository } from 'src/pokemons/repository/pokemon/pokemon.repository';
import { attemptCatch, calculateAttack } from './utils';
import {
  AttackOutcome,
  CatchOutcome,
  FightStatus,
  MAX_CATCH_ATTEMPTS,
} from './constants';

@Injectable()
export class FightingService {
  constructor(
    private readonly fightingRepository: FightingRepository,
    private readonly pokemonRepository: PokemonRepository,
  ) {}

  async create(createFightingDto: CreateFightingDto): Promise<Fighting> {
    const { pokemon1id, pokemon2id, intialHp } = createFightingDto;

    const pokemon1 = await this.pokemonRepository.findById(pokemon1id);
    if (!pokemon1) {
      throw new NotFoundException(`Pokémon with ID ${pokemon1id} not found`);
    }

    const pokemon2 = await this.pokemonRepository.findById(pokemon2id);
    if (!pokemon2) {
      throw new NotFoundException(`Pokémon with ID ${pokemon2id} not found`);
    }

    const data: Partial<Fighting> = {
      pokemon1id,
      pokemon2id,
      hp1: intialHp,
      hp2: intialHp,
      status: FightStatus.PRE_FIGHT,
      catchAttempts1: MAX_CATCH_ATTEMPTS,
      catchAttempts2: MAX_CATCH_ATTEMPTS,
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
  ): Promise<{ fight: Fighting; outcome: AttackOutcome }> {
    const { attackerId, defenderId } = attackDto;

    const currBattle = await this.fightingRepository.findOne(fightId);
    if (!currBattle) {
      throw new NotFoundException(`Battle with ID ${fightId} not found`);
    }
    if (currBattle.status === FightStatus.FINISHED) {
      throw new BadRequestException(`Battle with ID ${fightId} is not ongoing`);
    }

    const pokemonSet1 =
      currBattle.pokemon1id === attackerId &&
      currBattle.pokemon2id === defenderId;
    const pokemonSet2 =
      currBattle.pokemon2id === attackerId &&
      currBattle.pokemon1id === defenderId;

    if (!pokemonSet1 && !pokemonSet2) {
      throw new BadRequestException(
        `Invalid attacker or target IDs for this battle`,
      );
    }

    const attacker = await this.pokemonRepository.findById(attackerId);
    const defender = await this.pokemonRepository.findById(defenderId);

    if (!attacker && !defender) {
      throw new NotFoundException(`couldnt retrive attacker or defender`);
    }

    const defenderHpKey = pokemonSet1 ? Fighting['hp2'] : Fighting['hp1'];
    const defenderCurrentHp = pokemonSet1 ? currBattle.hp2 : currBattle.hp1;

    const newDefenderHp = calculateAttack(
      attacker,
      defender,
      defenderCurrentHp,
    );
    const attackOutcome =
      newDefenderHp < defenderCurrentHp
        ? AttackOutcome.SUCCESSFUL
        : AttackOutcome.MISSED;

    const updates: Partial<Fighting> = { [defenderHpKey]: newDefenderHp };
    if (newDefenderHp === 0) {
      updates.status = FightStatus.FINISHED;
    } else {
      updates.status = FightStatus.IN_FIGHT;
    }
    const updatedFight = await this.fightingRepository.update(fightId, updates);

    return { fight: updatedFight, outcome: attackOutcome };
  }

  async processCatch(
    fightId: string,
    catchDto: CatchDto,
  ): Promise<{ fight: Fighting; outcome: CatchOutcome }> {
    const { beingCatchedId } = catchDto;

    const currBattle = await this.fightingRepository.findOne(fightId);
    if (!currBattle) {
      throw new NotFoundException(`Battle with ID ${fightId} not found`);
    }
    if (currBattle.status === FightStatus.FINISHED) {
      throw new BadRequestException(`Battle with ID ${fightId} is not ongoing`);
    }

    if (
      currBattle.pokemon1id !== beingCatchedId &&
      currBattle.pokemon2id !== beingCatchedId
    ) {
      throw new BadRequestException(
        `Invalid catcher id this battle`,
      );
    }

    const beingCatched = await this.pokemonRepository.findById(beingCatchedId);
    if (!beingCatched) {
      throw new NotFoundException(`couldnt retrive pokemon being catched`);
    }

    const beingCatchedHp =
      currBattle.pokemon1id === beingCatchedId ? Fighting['hp1'] : Fighting['hp2'];

    const beingCatchedCatchAttempts =
      currBattle.pokemon1id === beingCatchedId ? Fighting['catchAttempts1'] : Fighting['catchAttempts2'];
      
    const isCatchSuccessful = attemptCatch(currBattle[beingCatchedHp]);
    let catchOutcome;
    const updates: Partial<Fighting> = {
      [beingCatchedCatchAttempts]: currBattle[beingCatchedCatchAttempts] - 1,
    };
    if (isCatchSuccessful) {
      await this.pokemonRepository.setOwned(beingCatchedId);
      catchOutcome = CatchOutcome.CAUGHT;
    } else if ((updates[beingCatchedCatchAttempts] === 0)) {
      
      updates.status = FightStatus.FINISHED;
      catchOutcome = CatchOutcome.FLED;
    } else {
      catchOutcome = CatchOutcome.MISSED;
    }

    const updatedFight = await this.fightingRepository.update(fightId, updates);

    return { fight: updatedFight, outcome: catchOutcome };
  }
}
