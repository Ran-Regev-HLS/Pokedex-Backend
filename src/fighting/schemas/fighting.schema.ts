import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { FightStatus } from '../constants';
@Schema()
export class Fighting extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Pokemon' })
  pcPokemonId: Types.ObjectId;

  @Prop()
  pcPokemonHP: number;

  @Prop([
    {
      pokemonId: { type: Types.ObjectId, ref: 'Pokemon' },
      hp: Number,
    },
  ])
  userPokemons: Array<{ pokemonId: Types.ObjectId; hp: number }>;

  @Prop({ type: Types.ObjectId, ref: 'Pokemon' })
  currentActivePokemonId: Types.ObjectId;

  @Prop()
  currentActivePokemonHP: number;

  @Prop()
  status: string;

  @Prop()
  catchAttempts: number;
}

export const FightingSchema = SchemaFactory.createForClass(Fighting);
