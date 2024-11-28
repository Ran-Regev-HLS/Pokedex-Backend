import { Module } from '@nestjs/common';
import { PokemonsService } from './pokemons.service';
import { PokemonsController } from './pokemons.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './schemas/pomemon.schema';
import { PokemonRepository } from './repository/pokemon/pokemon.repository';

@Module({
  imports: [MongooseModule.forFeature([{name: Pokemon.name, schema: PokemonSchema}])],
  controllers: [PokemonsController],
  providers: [PokemonRepository, PokemonsService],
})
export class PokemonsModule {}
 