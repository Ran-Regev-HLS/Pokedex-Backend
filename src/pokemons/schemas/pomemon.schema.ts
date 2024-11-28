import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'pokemons' })
export class Pokemon extends Document {
  @Prop({ required: true })
  id: number;

  @Prop({
    required: true,
    type: Object,
  })
  name: {
    english: string;
  };

  @Prop({ required: true })
  type: string[];

  @Prop({ type: Object })
  base: {
    HP: number;
    Attack: number;
    Defense: number;
    Speed: number;
  };

  @Prop()
  species: string;

  @Prop()
  description: string;

  @Prop({ type: Object })
  profile: {
    height: string;
    weight: string;
    egg: string[];
    ability: [string, string][];
    gender: string;
  };

  @Prop({ type: Object })
  image: {
    hires: string;
  };

  @Prop({ default: false })
  isOwned: boolean;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
