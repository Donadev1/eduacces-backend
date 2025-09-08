// src/acceso/dto/evento-acceso.dto.ts
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class EventoAccesoDto {
  @IsInt()
  @Type(() => Number) // convierte "23" -> 23
  id_sensor: number;

  @IsOptional()
  @IsString()
  device_id?: string; // opcional por si quieres identificar el ESP32
}
