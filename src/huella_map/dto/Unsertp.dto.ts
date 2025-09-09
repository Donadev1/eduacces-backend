import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class UpsertMappingDto {
  @IsInt()
  @Type(() => Number)
  id_sensor: number;

  @IsInt()
  @Type(() => Number)
  id_persona: number;
}
