import {
  Controller,
  Get,
  Logger,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { PokemonsService } from './pokemons.service';
import { FindPokemonsDto } from './dtos/findPokemonsDto';
import {
  FILTER_PROPERTY_NAME,
  SORT_FIELD_MAPPING,
  SORT_ORDER_MAPPING,
} from './constants';
import { FilterQuery } from 'mongoose';
import { Pokemon } from './schemas/pokemon.schema';

@Controller('pokemons')
export class PokemonsController {
  constructor(private readonly pokemonsService: PokemonsService) {}

  @Get()
  async findAll(@Query() query: FindPokemonsDto) {
    const { search, isOwned, sortField, sortOrder, startIndex, limit } = query;

    const filters: FilterQuery<Pokemon> = {};
    if (search)
      filters[FILTER_PROPERTY_NAME] = { $regex: search, $options: 'i' };
    if (isOwned) filters['isOwned'] = isOwned === 'true';

    const sort:Record<string, 1 | -1> = {
      [SORT_FIELD_MAPPING[sortField]]: SORT_ORDER_MAPPING[sortOrder],
    };

    Logger.log('Getting filtered Pokemon');
    try {
      const results = await this.pokemonsService.getFilteredPokemons(
        filters,
        sort,
        startIndex,
        limit,
      );
      if (!results.data.length) {
        Logger.warn('No Pokemons were found');
      } else {
        Logger.log(`Successfully retrieved ${results.total} results`);
      }
      return results;
    } catch (error) {
      Logger.error('Could not retrieve Pokemon', error);
      throw error;
    }
  }

  @Get('/random-opponent')
  async findRandomOpponent() {
    const opponent = await this.pokemonsService.getRandomOpponent();
    if (!opponent) {
      Logger.error('No unowned Pokemon found');
      throw new NotFoundException('No unowned Pokemon found');
    }
    return opponent;
  }
}
