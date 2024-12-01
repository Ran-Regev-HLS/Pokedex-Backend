import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FightStatus } from '../constants';

@Schema({ collection: 'fighting', timestamps: true })
export class Fighting extends Document {
  @Prop({ required: true })
  pcPokemonId: number; 

  @Prop({ required: true })
  pcPokemonHP: number; 

  @Prop({
    type: [Object],
    required: true,
  })
  userPokemons: {
    pokemonId: number; 
    hp: number; 
  }[]; 

  @Prop({ required: true })
  currentActivePokemonId: number; 

  @Prop({ required: true })
  currentActivePokemonHP: number; 

  @Prop({
    type: String,
    enum: FightStatus,
    default: FightStatus.PRE_FIGHT,
  })
  status: FightStatus;

  @Prop({ required: true })
  catchAttempts: number; 
}

export const FightingSchema = SchemaFactory.createForClass(Fighting);
