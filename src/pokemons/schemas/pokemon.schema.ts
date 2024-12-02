import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Pokemon extends Document {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  name:  string;

  @Prop({ required: true })
  
  type: string[];
  @Prop()
  hp: number;

  @Prop()
  Attack: number;

  @Prop()
  Defense: number;

  @Prop()
  Speed: number;

  @Prop()
  'Sp. Attack'?: number;

  @Prop()
  'Sp. Defense'?: number;

  @Prop()
  height: string;

  @Prop()
  weight: string;

  @Prop()
  ability: [string, string][];

  @Prop()
  species: string;

  @Prop()
  description: string;


  @Prop()
  image: string;

  @Prop({ default: false })
  isOwned: boolean;

  readonly _id:Types.ObjectId;

}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
