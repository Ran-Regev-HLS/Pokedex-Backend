import { IsString, IsInt, Min, IsEnum, IsNumber } from 'class-validator';
import { ATTACKER } from '../constants';
import { Transform } from 'class-transformer';


export class AttackDto {
  @IsEnum(Object.keys(ATTACKER), {
    message: `Attacker idendifier must be one of: ${Object.keys(ATTACKER).join(', ')}`,
  })
  attacker: ATTACKER;
}

export class SwitchPokemonDto{
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  newPokemonId: number;
}
