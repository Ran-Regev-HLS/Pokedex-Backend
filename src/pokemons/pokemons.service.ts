import { Injectable } from '@nestjs/common';
import { Pokemon } from './schemas/pokemon.schema';
import { PokemonRepository } from './pokemon.repository';

@Injectable()
export class PokemonsService {
    constructor(private readonly pokemonRepo: PokemonRepository) {}

    async getFilteredPokemons(
      filters: any,
      sort: any,
      startIndex: number,
      limit: number,
    ) {
      return this.pokemonRepo.findWithFilters(filters, sort, startIndex, limit);
    }

    
  async getRandomOpponent(){
    return this.pokemonRepo.getRandomUnownedPokemon();
  }

} 
