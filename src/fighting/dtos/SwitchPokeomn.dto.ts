import { IsString } from "class-validator";
import { Types } from "mongoose";

export class SwitchPokemonDto{
    @IsString()
    newPokemonId: Types.ObjectId;
  
  }