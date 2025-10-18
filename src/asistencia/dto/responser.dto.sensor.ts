import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ResponseDtoRegister {
  @IsNotEmpty()
  @IsString()
  ok: string;

  @IsNotEmpty()
  @IsInt()
  @MinLength(1)
  @MaxLength(20)
  id_registro: number;

  @IsNotEmpty()
  @IsInt()
  @MinLength(100)
  @MaxLength(200)
  confiace: number;
}
