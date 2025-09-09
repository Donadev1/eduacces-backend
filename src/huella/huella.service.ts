import { BadRequestException, Injectable } from '@nestjs/common';
import { HuellaMapService } from 'src/huella_map/huella_map.service';
import { SensorClientService } from 'src/sensor-client/sensor-client.service';

@Injectable()
export class HuellaService {
  constructor(
    private readonly huellaMapService: HuellaMapService,
    private readonly sensorClientService: SensorClientService,
  ) {}
  async enrroll(id_persona: number) {
    if (id_persona < 1 || id_persona > 127) {
      throw new BadRequestException('id_persona debe estar entre 1 y 127');
    }
    const enrolled = await this.sensorClientService.enroll(id_persona);
    if (!enrolled) {
      throw new BadRequestException('No se pudo enrollar la huella');
    }
    // Si se enrolló correctamente, retornamos el mapeo
    const mapping = await this.huellaMapService.upsertMapping(
      id_persona,
      id_persona,
    );
    return { ok: true, data: mapping };
  }
  async delete(id_persona: number) {
    if (id_persona < 1 || id_persona > 127) {
      throw new BadRequestException('id_persona debe estar entre 1 y 127');
    }

    const deleted = await this.sensorClientService.delete(id_persona);
    if (!deleted) {
      throw new BadRequestException('No se pudo eliminar la huella');
    }

    const n = await this.huellaMapService.deleteByPersona(id_persona);
    return { ok: true, deleted: n };
  }
}
