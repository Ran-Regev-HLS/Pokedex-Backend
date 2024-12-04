import { Injectable } from '@nestjs/common';
import { Pokemon } from './schemas/pokemon.schema';
import { PokemonRepository } from './pokemon.repository';
import { FilterQuery, Types } from 'mongoose';

@Injectable()
export class PokemonsService {
  constructor(private readonly pokemonRepo: PokemonRepository) {}

  async getFilteredPokemons(
    filters: FilterQuery<Pokemon>,
    sort: Record<string, 1 | -1> = {}, 
    startIndex: number = 0, 
    limit: number = 0
  ): Promise<{ data: Pokemon[]; total: number }> {
    return this.pokemonRepo.findWithFilters(filters, sort, startIndex, limit);
  }
  
  async getRandomOpponent() {
    return this.pokemonRepo.getRandomUnownedPokemon();
  }

  findById(pokemonId: Types.ObjectId) {
    return this.pokemonRepo.findById(pokemonId);
  }
}
