import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FightingRepository } from './fighting.repository';
import { Fighting } from './schemas/fighting.schema';
import {
  AttackOutcome,
  CatchOutcome,
  FightStatus,
  MAX_CATCH_ATTEMPTS,
} from './constants';
import { PokemonsService } from 'src/pokemons/pokemons.service';
import { Types } from 'mongoose';

@Injectable()
export class FightingService {
  constructor(
    private readonly fightingRepository: FightingRepository,
    private readonly pokemonService: PokemonsService,
  ) {}

  async create(): Promise<Fighting> {

    const pcPokemon = await this.pokemonService.getRandomOpponent();
    if(!pcPokemon){
      throw new NotFoundException("couldnt get an opponent pokemon")
    }
    const userPokemons = await this.pokemonService.getFilteredPokemons({ isOwned: true })
    if(!userPokemons.total){ 
      throw new NotFoundException("user doesnt have pokemons")
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

    return this.fightingRepository.create(data);
  }

  
}
