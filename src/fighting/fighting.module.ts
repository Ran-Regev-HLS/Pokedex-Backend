import { Module } from '@nestjs/common';
import { FightingService } from './fighting.service';
import { FightingController } from './fighting.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Fighting, FightingSchema } from './schemas/fighting.schema';
import { FightingRepository } from './fighting.repository';
import { Pokemon, PokemonSchema } from 'src/pokemons/schemas/pokemon.schema';
import { PokemonRepository } from 'src/pokemons/pokemon.repository';
import { PokemonsService } from 'src/pokemons/pokemons.service';

@Module({
  imports: [MongooseModule.forFeature([{name: Fighting.name, schema: FightingSchema}]), 
  MongooseModule.forFeature([{name: Pokemon.name, schema: PokemonSchema}])],
  controllers: [FightingController],
  providers: [FightingService, FightingRepository, PokemonsService, PokemonRepository],
})
export class FightingModule {}
