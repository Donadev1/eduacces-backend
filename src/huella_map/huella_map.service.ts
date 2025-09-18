import { Injectable } from '@nestjs/common';
import { HuellaMapRepository } from './huella_map.repository';
import { HuellaMap } from 'src/models/hulla_map';

@Injectable()
export class HuellaMapService {
  constructor(private readonly huellaMapRepository: HuellaMapRepository) {}
  findBySensor(id_sensor: number) {
    return this.huellaMapRepository.findBySensor(id_sensor);
  }
  upsertMapping(id_sensor: number, id_persona: number) {
    return this.huellaMapRepository.upsertMapping(id_sensor, id_persona);
  }
  deleteByPersona(id_persona: number) {
    return this.huellaMapRepository.deleteByPersona(id_persona);
  }
  touchLastSeen(id_sensor: number) {
    return this.huellaMapRepository.touchLastSeen(id_sensor);
  }
  async FindAll(): Promise<HuellaMap[]> {
    return this.huellaMapRepository.FindAll();
  }
}
