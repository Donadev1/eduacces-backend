import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { col } from 'sequelize';
import { HuellaMap } from 'src/models/hulla_map';
import { Persona } from 'src/models/persona.model';

@Injectable()
export class HuellaMapRepository {
  constructor(@InjectModel(HuellaMap) private model: typeof HuellaMap) {}

  findBySensor(id_sensor: number) {
    return this.model.findByPk(id_sensor, {
      include: [
        {
          model: Persona,
          attributes: ['id_persona', 'nombre', 'apellido', 'documento'],
        },
      ],
    });
  }

  async upsertMapping(id_sensor: number, id_persona: number) {
    const existing = await this.model.findByPk(id_sensor);
    if (existing) {
      existing.id_persona = id_persona;
      existing.fecha_registro = new Date();
      return existing.save();
    }
    return this.model.create({
      id_sensor,
      id_persona,
      fecha_registro: new Date(),
    } as any);
  }

  deleteByPersona(id_persona: number) {
    return this.model.destroy({ where: { id_persona } });
  }

  touchLastSeen(id_sensor: number) {
    return this.model.update(
      { last_seen: new Date() },
      { where: { id_sensor } },
    );
  }

  async FindAll(): Promise<HuellaMap[]> {
    return this.model.findAll({
      attributes: ['id_sensor', [col('persona.nombre'), 'persona']],
      include: [{ model: Persona, attributes: [] }],
      raw: true,
    });
  }

  // findPersonIdFromIdSensor(id_sensor)
}
