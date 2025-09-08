import { Injectable } from '@nestjs/common';
import { AsistenciaRepository } from './asistencia.repository';

@Injectable()
export class AsistenciaService {
  constructor(private readonly asistenciaRepository: AsistenciaRepository) {}

  findLastOfDay(id_persona: number, fechaISO: string) {
    return this.asistenciaRepository.findLastOfDay(id_persona, fechaISO);
  }

  createEntrada(id_persona: number, fechaISO: string, hora: string) {
    return this.asistenciaRepository.createEntrada(id_persona, fechaISO, hora);
  }

  marcarSalida(row: any, hora: string) {
    return this.asistenciaRepository.marcarSalida(row, hora);
  }
}
