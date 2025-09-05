import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Min,
  IsInt,
} from 'class-validator';
export class CreatePersonaDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  documento: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  nombre: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  apellido: string;

  @IsNotEmpty()
  @IsEmail()
  @MinLength(5)
  @MaxLength(100)
  correo: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(7)
  @MaxLength(15)
  telefono: string;
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  id_rol: number;
}
