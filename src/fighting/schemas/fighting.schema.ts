import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import { FightStatus } from "../constants";

@Schema()
export class Fighting extends Document {
  @Prop({ required: true })
  pokemon1id: number;

  @Prop({ required: true })
  pokemon2id: number;

  @Prop({ required: true })
  hp1: number;

  @Prop({ required: true })
  hp2: number;

  @Prop({
    type: String,
    enum: FightStatus,
    default: FightStatus.PRE_FIGHT,
  })
  status: FightStatus;

  @Prop({ required: true })
  catchAttempts1: number;

  @Prop({ required: true })
  catchAttempts2: number;
}

export const FightingSchema = SchemaFactory.createForClass(Fighting);
