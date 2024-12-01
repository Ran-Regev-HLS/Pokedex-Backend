import { Transform } from 'class-transformer';
import { IsString, IsInt, Min, IsEnum } from 'class-validator';
import { ATTACKER } from '../constants';

export class AttackDto {
  @IsEnum(Object.keys(ATTACKER), {
    message: `Attacker idendifier must be one of: ${Object.keys(ATTACKER).join(', ')}`,
  })
  attacker: ATTACKER;
}

