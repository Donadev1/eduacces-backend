import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  correo!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsInt()
  id_persona!: number;

  @IsOptional()
  estado?: boolean;
}
