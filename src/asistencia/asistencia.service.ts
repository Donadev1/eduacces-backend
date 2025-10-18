import { Injectable } from '@nestjs/common';
import { AsistenciaRepository } from './asistencia.repository';
import { SensorClientService } from 'src/sensor-client/sensor-client.service';
import { ResponseDtoRegister } from './dto/responser.dto.sensor';

@Injectable()
export class AsistenciaService {
  constructor(
    private readonly asistenciaRepository: AsistenciaRepository,
    private readonly sensorClient: SensorClientService,
  ) {}

  findLastOfDay(id_persona: number, fechaISO: string) {
    return this.asistenciaRepository.findLastOfDay(id_persona, fechaISO);
  }

  createEntrada(id_persona: number, fechaISO: string, hora: string) {
    return this.asistenciaRepository.createEntrada(id_persona, fechaISO, hora);
  }

  async registerAccess() {
    const resp = await this.sensorClient.find();

    const data = JSON.parse(JSON.stringify(resp)) as ResponseDtoRegister;
    return data;
  }

  marcarSalida(row: any, hora: string) {
    return this.asistenciaRepository.marcarSalida(row, hora);
  }
}
