import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { AsistenciaRepository } from './asistencia.repository';
import { SensorClientService } from 'src/sensor-client/sensor-client.service';
import { HuellaMapService } from 'src/huella_map/huella_map.service';

@Injectable()
export class AsistenciaService {
  private readonly logger = new Logger(AsistenciaService.name);

  constructor(
    private readonly asistenciaRepository: AsistenciaRepository,
    private readonly sensorClient: SensorClientService,
    private readonly huella_map_service: HuellaMapService,
  ) {}

  async findByPk(id_persona: number) {
    return this.asistenciaRepository.findByPk(id_persona);
  }

  findLastOfDay(id_persona: number, fechaISO: Date) {
    return this.asistenciaRepository.findLastOfDay(id_persona, fechaISO);
  }

  createEntrada(id_persona: number, fechaISO: Date) {
    return this.asistenciaRepository.createEntrada(id_persona, fechaISO);
  }

  async registerAccess() {
    const data_person = await this.getAsistence();
    if (data_person) {
      const fecha = new Date();
      await this.createEntrada(data_person.sensorData.data.id_registro, fecha);
      return data_person;
    }
  }

  async marcarSalida() {
    const data = await this.getAsistence();
    if (!data)
      throw new NotFoundException('Sensor no identificado o confianza baja');

    const mapping = await this.huella_map_service.findBySensor(
      data.sensorData.data.id_registro,
    );
    if (!mapping)
      throw new NotFoundException('No existe mapping de sensor a persona');

    const asistencia = await this.findLastOfDay(mapping.id_persona, new Date());
    if (!asistencia)
      throw new NotFoundException('No hay registro de entrada para hoy');

    try {
      const time = new Date().toISOString().slice(11, 23); // UTC HH:MM:SS.mmm
      const updated = await this.asistenciaRepository.marcarSalida(
        asistencia.id_asistencia,
        time,
      );
      if (!updated)
        throw new InternalServerErrorException(
          'No se pudo actualizar la asistencia',
        );
      return { success: true, data: updated };
    } catch (err) {
      Logger.error('Error marcando salida', err.stack || err);
      // re-lanzar como 500 si no es HttpException
      throw err.status
        ? err
        : new InternalServerErrorException(
            'Error interno al actualizar asistencia',
          );
    }
  }

  private async getAsistence() {
    try {
      const data = await this.sensorClient.find();
      if (!data || !data.data) {
        this.logger.warn('Respuesta inválida del sensor', JSON.stringify(data));
        throw new ServiceUnavailableException('Respuesta inválida del sensor');
      }

      // umbral de confianza (confianza es la precision al tomar el la foto)
      if (
        typeof data.data.confianza !== 'number' ||
        data.data.confianza <= 100
      ) {
        throw new BadRequestException('Confianza del sensor insuficiente');
      }

      // buscar mapping
      const mapping = await this.huella_map_service.findBySensor(
        data.data.id_registro,
      );
      if (!mapping) {
        // opcional: podrías devolver null en vez de lanzar y manejar en caller
        throw new NotFoundException(
          `Sensor ${data.data.id_registro} no mapeado a persona`,
        );
      }

      return { sensorData: data, mapping };
    } catch (err) {
      // si ya es HttpException, re-lanzar para que Nest lo maneje
      if (err.getStatus && typeof err.getStatus === 'function') {
        throw err;
      }

      // errores de conexión / parse / inesperados
      this.logger.error('Error obteniendo datos del sensor', err?.stack ?? err);

      // si el fallo viene del sensor o la red, ServiceUnavailable; si es interno parse error, InternalServerError
      if (err instanceof SyntaxError) {
        throw new InternalServerErrorException(
          'Error procesando respuesta del sensor',
        );
      }
      throw new ServiceUnavailableException(
        'No se pudo conectar con el sensor',
      );
    }
  }
}
