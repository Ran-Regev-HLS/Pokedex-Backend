import { IsOptional, IsString, IsBooleanString, IsIn, IsInt, Min } from 'class-validator';
import { SORT_FIELD_MAPPING, SORT_ORDER_MAPPING } from '../constants';
import { Transform } from 'class-transformer';

export class FindPokemonsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsBooleanString()
  isOwned?: string;

  @IsOptional()
  @IsString()
  @IsIn(Object.keys(SORT_FIELD_MAPPING), { 
    message: `sortField must be one of: ${Object.keys(SORT_FIELD_MAPPING).join(', ')}`,
  })
  sortField: string = 'name.english'; 

  @IsOptional()
  @IsIn(Object.keys(SORT_ORDER_MAPPING), {
    message: `sortOrder must be one of: ${Object.keys(SORT_ORDER_MAPPING).join(', ')}`,
  })
  sortOrder: string = 'asc'; 

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10)) 
  @IsInt()
  @Min(0)
  page: number = 0; 

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10)) 
  @IsInt()
  @Min(0)
  itemsPerPage: number = 0; 
}
 