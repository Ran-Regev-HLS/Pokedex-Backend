import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PokemonsModule } from './pokemons/pokemons.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FightingModule } from './fighting/fighting.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/pokedex-db'),
    PokemonsModule,
    FightingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
