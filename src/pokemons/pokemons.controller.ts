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

@Controller('pokemons')
export class PokemonsController {
  constructor(private readonly pokemonsService: PokemonsService) {}

  @Get()
  async findAll(@Query() query: FindPokemonsDto) {
    const { search, isOwned, sortField, sortOrder, startIndex, limit } = query;

    const filters: any = {};
    if (search)
      filters[FILTER_PROPERTY_NAME] = { $regex: search, $options: 'i' };
    if (isOwned) filters['isOwned'] = isOwned === 'true';

    const sort = {
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
      results.data.length === 0
        ? Logger.log(`No Pokemons were found`)
        : Logger.log(`Successfully retrieved ${results.total} results`);
      return results;
    } catch (error) {
      Logger.error('Could not retrieve Pokemon', error.stack);
      throw error;
    }
  }

  @Get('/random-opponent')
  async findRandomOpponent() {
    const opponent = await this.pokemonsService.getRandomOpponent();
    if (!opponent) {
      throw new NotFoundException('No unowned Pokemon found');
    }
    return opponent;
  }

}
