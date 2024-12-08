import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document,  Types } from 'mongoose';
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
      _id: false,
    },
  ])
  userPokemons: Array<{ pokemonId: Types.ObjectId; hp: number }>;

  @Prop({ type: Types.ObjectId, ref: 'Pokemon' })
  currentActivePokemonId: Types.ObjectId;

  @Prop()
  currentActivePokemonHP: number;

  @Prop()
  status: FightStatus;

  @Prop()
  catchAttempts: number;

  @Prop()
  userTurn: Boolean;

  readonly _id:Types.ObjectId;
}

export const FightingSchema = SchemaFactory.createForClass(Fighting);
