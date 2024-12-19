import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  cognitoId: string;

  @Prop({ required: true, unique: true })
  email: string;

  readonly _id:Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
