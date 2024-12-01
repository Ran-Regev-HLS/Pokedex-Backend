import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { profile } from 'console';
import { FilterQuery, Model } from 'mongoose';
import { Pokemon } from 'src/pokemons/schemas/pokemon.schema';

@Injectable()
export class PokemonRepository {
  constructor(
    @InjectModel(Pokemon.name) private pokemonModel: Model<Pokemon>,
  ) {}

  async findWithFilters(
    filters: FilterQuery<Pokemon>,
    sort?: Record<string, 1 | -1>,
    startIndex?: number,
    limit?: number,
  ): Promise<{ data: Pokemon[]; total: number }> {
    const total = await this.pokemonModel.countDocuments(filters).exec();
    const data = await this.pokemonModel
      .find(filters)
      .sort(sort)
      .skip(startIndex)
      .limit(limit)
      .lean<Pokemon[]>();
  
    return { data, total };
  }

  async getRandomUnownedPokemon(): Promise<Pokemon | null> {
    const result = await this.pokemonModel.aggregate([
      { $match: { isOwned: false } },
      { $sample: { size: 1 } },
    ]);
    return result[0] || null;
  }

  async findById(pokemonId: number): Promise<Pokemon | null> {
    return this.pokemonModel.findOne({ id: pokemonId }).exec(); // Adjust field name if needed
  }
  async setOwned(beingCatchedId: number) {
    return this.pokemonModel.updateOne({id: beingCatchedId, isOwned: true})
  }
}
