import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Pokemon } from 'src/pokemons/schemas/pomemon.schema';

@Injectable()
export class PokemonRepository {
  constructor(
    @InjectModel(Pokemon.name) private pokemonModel: Model<Pokemon>,
  ) {}

  async findWithFilters(
    filters: FilterQuery<Pokemon>,
    sort: Record<string, 1 | -1>,
    page: number,
    itemsPerPage: number,
  ): Promise<{ data: Pokemon[]; total: number }> {
    const skip = page * itemsPerPage;
    const total = await this.pokemonModel.countDocuments(filters).exec();
    const data = await this.pokemonModel
      .find(filters)
      .sort(sort)
      .skip(skip)
      .limit(itemsPerPage)
      .lean<Pokemon[]>();

    return { data, total };
  }

  async getRandomUnownedPokemon(): Promise<Pokemon | null> {
    const count = await this.pokemonModel.countDocuments({ isOwned: false });

    if (count === 0) {
      throw new NotFoundException('No unowned Pokemon found');
    }

    const randomIndex = Math.floor(Math.random() * count);
    return this.pokemonModel.findOne({ isOwned: false }).skip(randomIndex);
  }
}
