import { Module } from '@nestjs/common';
import { FightingService } from './fighting.service';
import { FightingController } from './fighting.controller';
import { PokemonRepository } from 'src/pokemons/repository/pokemon/pokemon.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Fighting, FightingSchema } from './schemas/fighting.schema';
import { FightingRepository } from './repository/fighting.repository';
import { Pokemon, PokemonSchema } from 'src/pokemons/schemas/pomemon.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: Fighting.name, schema: FightingSchema}]), 
  MongooseModule.forFeature([{name: Pokemon.name, schema: PokemonSchema}])],
  controllers: [FightingController],
  providers: [FightingService, FightingRepository, PokemonRepository],
})
export class FightingModule {}
