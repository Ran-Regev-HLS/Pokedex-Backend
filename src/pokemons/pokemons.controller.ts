import { Controller, Get, Query } from '@nestjs/common';
import { PokemonsService } from './pokemons.service';
import { FindPokemonsDto } from './dtos/findPokemonsDto';
import { FILTER_PROPERTY_NAME, SORT_FIELD_MAPPING, SORT_ORDER_MAPPING } from './constants';

@Controller('pokemons')
export class PokemonsController {
  constructor(private readonly pokemonsService: PokemonsService) {}

  @Get()
  async findAll(@Query() query: FindPokemonsDto) {
    const { search, isOwned, sortField, sortOrder, page, itemsPerPage } = query;
    const filters: any = {};
    if (search) filters[FILTER_PROPERTY_NAME] = { $regex: search, $options: 'i' };
    if (isOwned) filters.isOwned = isOwned === 'true';

    const sort = { [SORT_FIELD_MAPPING[sortField] ]: SORT_ORDER_MAPPING[sortOrder] };

    return this.pokemonsService.getFilteredPokemons(
      filters,
      sort,
      page,
      itemsPerPage,
    );
  }
  @Get('/random-opponent')
  async findRandomOpponent() {
    return this.pokemonsService.getRandomOpponent();
  }
}
 