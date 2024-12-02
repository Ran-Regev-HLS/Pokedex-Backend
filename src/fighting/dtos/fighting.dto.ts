import { IsString, IsInt, Min, IsEnum, IsNumber } from 'class-validator';
import { ATTACKER } from '../constants';
import { Transform } from 'class-transformer';
import { ObjectId, Types } from 'mongoose';


export class AttackDto {

  @IsEnum((ATTACKER), {
    message: `Attacker idendifier must be one of: ${Object.values(ATTACKER).join(', ')}`,
  })
  attacker: ATTACKER;
}

export class SwitchPokemonDto{
  @IsString()
  newPokemonId: Types.ObjectId;

}
