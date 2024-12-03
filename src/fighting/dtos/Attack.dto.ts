import {  IsEnum } from 'class-validator';
import { ATTACKER } from '../constants';

export class AttackDto {

  @IsEnum((ATTACKER), {
    message: `Attacker idendifier must be one of: ${Object.values(ATTACKER).join(', ')}`,
  })
  attacker: ATTACKER;
}


