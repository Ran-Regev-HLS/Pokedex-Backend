import { Transform } from 'class-transformer';
import { IsString, IsInt, Min } from 'class-validator';

export class CreateFightingDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  pokemon1id: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  pokemon2id: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  intialHp: number;
}

export class AttackDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  attackerId: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  defenderId: number;
}

export class CatchDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  beingCatchedId: number;
}
