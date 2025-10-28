import { Injectable } from '@nestjs/common';
import { AsistenciaRepository } from './asistencia.repository';
import { SensorClientService } from 'src/sensor-client/sensor-client.service';
import { ResponseDtoRegister } from './dto/responser.dto.sensor';
import { HuellaMapService } from 'src/huella_map/huella_map.service';
import { asistencia } from 'src/models/asistencia.model';

@Injectable()
export class AsistenciaService {
  constructor(
    private readonly asistenciaRepository: AsistenciaRepository,
    private readonly sensorClient: SensorClientService,
    private readonly huella_map_service: HuellaMapService,
  ) {}

  findLastOfDay(id_persona: number, fechaISO: Date) {
    return this.asistenciaRepository.findLastOfDay(id_persona, fechaISO);
  }

  createEntrada(id_persona: number, fechaISO: Date) {
    return this.asistenciaRepository.createEntrada(id_persona, fechaISO);
  }

  async registerAccess() {
    const resp = await this.sensorClient.find();

    const data = JSON.parse(JSON.stringify(resp)) as ResponseDtoRegister;

    if (data.data.confianza >= 120) {
      const fecha = new Date();

      const data_person = await this.huella_map_service.findBySensor(
        data.data.id_registro,
      );
      if (data_person) {
        await this.createEntrada(data_person.id_persona, fecha);
      }
    }
    return data;
  }

  async marcarSalida() {
    const resp = await this.sensorClient.find();

    const data = JSON.parse(JSON.stringify(resp)) as ResponseDtoRegister;

    if (data.data.confianza >= 120) {
      const utc_hours = new Date().getUTCHours().toString().padStart(2, '0');
      const utc_minutes = new Date()
        .getUTCMinutes()
        .toString()
        .padStart(2, '0');
      const utc_seconds = new Date().getUTCSeconds();
      const utc_milliseconds = new Date().getUTCMilliseconds();
      const time = `${utc_hours}:${utc_minutes}:${utc_seconds}.${utc_milliseconds}`;

      const tmp = await this.huella_map_service.findBySensor(
        data.data.id_registro,
      );
      const id_persona = tmp?.id_persona ?? 0;
      const asistencia = await this.findLastOfDay(id_persona, new Date());

      if (asistencia) {
        return this.asistenciaRepository.marcarSalida(
          asistencia.id_asistencia,
          time,
        );
      }
    }
  }

  async getAsistence() {
    const resp = await this.sensorClient.find();

    const data = JSON.parse(JSON.stringify(resp)) as ResponseDtoRegister;

    if (data.data.confianza >= 120) {
      return await this.huella_map_service.findBySensor(data.data.id_registro);
    } else {
      return JSON.parse(
        '{\
        "ok": false,\
        ""\
        }',
      ) as ResponseDtoRegister;
    }
  }
}
