import { IsOptional, IsString } from 'class-validator';

export class UpdateCarreraDto {
  @IsString()
  @IsOptional()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion: string;
}
