import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

class DataDto {
  @IsNotEmpty()
  @IsInt()
  @MinLength(1)
  @MaxLength(20)
  id_registro: number;

  @IsNotEmpty()
  @IsInt()
  @MinLength(100)
  @MaxLength(200)
  confianza: number;
}

export class ResponseDtoRegister {
  @IsNotEmpty()
  @IsString()
  ok: string;

  data: DataDto;
}
