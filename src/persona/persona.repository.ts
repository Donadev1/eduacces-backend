import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { col } from 'sequelize';
import { persona } from 'src/models/persona.model';
import { rol } from 'src/models/rol.model';
import { CreatePersonaDto } from './dto/create.persona.dto';
import { UpdatePersonaDto } from './dto/update.persona.dto';

@Injectable()
export class PersonaRepository {
  constructor(
    @InjectModel(persona)
    private personaModel: typeof persona,
  ) {}

  async findAll(): Promise<persona[]> {
    return this.personaModel.findAll({
      attributes: [
        'id_persona',
        'documento',
        'nombre',
        'apellido',
        'correo',
        'telefono',
        [col('rol.nombre'), 'rol'],
      ],
      include: [{ model: rol, attributes: [] }],
      raw: true,
    });
  }

  async findById(id_persona: number): Promise<persona | null> {
    return this.personaModel.findByPk(id_persona, {
      attributes: [
        'id_persona',
        'documento',
        'nombre',
        'apellido',
        'correo',
        'telefono',
        [col('rol.nombre'), 'rol'],
      ],
      include: [{ model: rol, attributes: [] }],
      raw: true,
    });
  }

  async create(createpersonadto: CreatePersonaDto): Promise<persona> {
    return this.personaModel.create(createpersonadto);
  }

  async findByDocumento(documento: string): Promise<persona | null> {
    return this.personaModel.findOne({ where: { documento } });
  }

  async findByCorreo(correo: string): Promise<persona | null> {
    return this.personaModel.findOne({ where: { correo } });
  }

  async update(
    id_persona: number,
    updateperson: UpdatePersonaDto,
  ): Promise<persona | null> {
    const personaDb = await this.personaModel.findByPk(id_persona);
    if (!personaDb) {
      return null;
    }
    await personaDb.update(updateperson);
    return personaDb;
  }

  async remove(id_persona: number): Promise<boolean> {
    const deleted = await this.personaModel.destroy({
      where: { id_persona },
    });
    return deleted > 0;
  }

  findByIdWithRol(id_persona: number) {
    return this.personaModel.findByPk(id_persona, {
      include: [{ model: rol, as: 'rol', attributes: ['id_rol', 'nombre'] }],
    });
  }
}
