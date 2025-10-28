import { Injectable } from '@nestjs/common';
import { AsistenciaService } from 'src/asistencia/asistencia.service';
import { HuellaMapService } from 'src/huella_map/huella_map.service';

@Injectable()
export class AccesoService {
  constructor(
    private readonly asistenciaService: AsistenciaService,
    private readonly huellaMapService: HuellaMapService,
  ) {}

  private hoyISO() {
    return new Date().toISOString().slice(0, 10);
  }
  private ahora() {
    return new Date().toTimeString().slice(0, 8);
  }

  /**
   * Evento principal: viene del ESP32 con id_sensor (slot del AS608).
   * Mapea a id_persona y hace toggle de asistencia.
   */
  async procesarPorSensor(id_sensor: number) {
    const map = await this.huellaMapService.findBySensor(id_sensor);
    if (!map) return { action: 'unknown', reason: 'sensor_not_mapped' };

    await this.huellaMapService.touchLastSeen(id_sensor);

    const id_persona = map.id_persona;
    const fecha = new Date();
    const hora = this.ahora();

    const last = await this.asistenciaService.findLastOfDay(id_persona, fecha);
    if (!last) {
      const row = await this.asistenciaService.createEntrada(id_persona, fecha);
      return {
        action: 'entrada',
        id_persona,
        id_asistencia: row.id_asistencia,
        persona: map.persona
          ? { nombre: map.persona.nombre, apellido: map.persona.apellido }
          : undefined,
      };
    }

    if (!last.hora_salida) {
      const row = await this.asistenciaService.marcarSalida(hora);
      return {
        action: 'salida',
        id_persona,
        id_asistencia: row?.id_asistencia,
        persona: map.persona
          ? { nombre: map.persona.nombre, apellido: map.persona.apellido }
          : undefined,
      };
    }

    return {
      action: 'noop',
      id_persona,
      id_asistencia: last.id_asistencia,
      persona: map.persona
        ? { nombre: map.persona.nombre, apellido: map.persona.apellido }
        : undefined,
    };
  }
}
