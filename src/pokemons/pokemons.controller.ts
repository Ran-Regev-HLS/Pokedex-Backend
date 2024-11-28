import { Controller, Get, Logger, Query } from '@nestjs/common';
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

    const sort = { [SORT_FIELD_MAPPING[sortField] ]: SORT_ORDER_MAPPING[sortOrder] };
    Logger.debug("getting filtered pokemons")
    try {
      const results =  await this.pokemonsService.getFilteredPokemons(
        filters,
        sort,
        page,
        itemsPerPage,
      );
      Logger.debug(`succesfully retrived ${results.total} results`)
      return results;
    } catch (error) {
      Logger.error("couldnt retrive pokemons")
    }
    
    
  }
  @Get('/random-opponent')
  async findRandomOpponent() {
    return await this.pokemonsService.getRandomOpponent();
  }
}
 