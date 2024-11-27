import { Injectable } from '@nestjs/common';
import { Pokemon } from './schemas/pomemon.schema';
import { PokemonRepository } from './repository/pokemon/pokemon.repository';

@Injectable()
export class PokemonsService {
    constructor(private readonly pokemonRepo: PokemonRepository) {}

  async getFilteredPokemons(
    filters: any,
    sort: any,
    page?: number,
    itemsPerPage?: number,
  ) {

    return this.pokemonRepo.findWithFilters(filters, sort, page, itemsPerPage);
  }

  async getRandomOpponent(){
    return this.pokemonRepo.getRandomUnownedPokemon();
  }
}
