import { Module } from '@nestjs/common';
import { FightingService } from './fighting.service';
import { FightingController } from './fighting.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Fighting, FightingSchema } from './schemas/fighting.schema';
import { FightingRepository } from './fighting.repository';
import { PokemonsModule } from 'src/pokemons/pokemons.module';

@Module({
  imports: [MongooseModule.forFeature([{name: Fighting.name, schema: FightingSchema}]), 
  PokemonsModule],
  controllers: [FightingController],
  providers: [FightingService, FightingRepository],
})
export class FightingModule {}
