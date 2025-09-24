import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Carrera } from 'src/models/carrera.model';
import { EstudianteFicha } from 'src/models/estudiante-ficha.model';
import { Ficha } from 'src/models/ficha.model';
import { persona } from 'src/models/persona.model';

@Injectable()
export class EstudianteFichaService {
  constructor(
    @InjectModel(EstudianteFicha)
    private readonly model: typeof EstudianteFicha,
  ) {}

  async findAll(): Promise<EstudianteFicha[]> {
    return this.model.findAll({
      attributes: {
        exclude: ['id_estudiante_ficha', 'id_persona', 'id_ficha'],
      },
      include: [
        {
          model: Ficha,
          attributes: {
            exclude: ['id_ficha', 'id_carrera'],
          },
          include: [
            { model: Carrera, attributes: { exclude: ['id_carrera'] } },
          ],
        },
        { model: persona, attributes: { exclude: ['id_persona', 'id_rol'] } },
      ],
    });
  }

  async findOne(id_estudiante_ficha: number): Promise<EstudianteFicha | null> {
    return this.model.findOne({
      where: { id_estudiante_ficha },
      include: [
        {
          model: Ficha,
          attributes: {
            exclude: ['id_ficha', 'id_carrera'],
          },
          include: [
            { model: Carrera, attributes: { exclude: ['id_carrera'] } },
          ],
        },
        { model: persona, attributes: { exclude: ['id_persona', 'id_rol'] } },
      ],
    });
  }

  async create(
    dto: Omit<EstudianteFicha, 'id_estudiante_ficha'>,
  ): Promise<EstudianteFicha> {
    return this.model.create(dto);
  }

  async update(
    id_estudiante_ficha: number,
    dto: Partial<Omit<EstudianteFicha, 'id_estudiante_ficha'>>,
  ) {
    return this.model.update(dto, {
      where: { id_estudiante_ficha },
    });
  }

  async delete(id_estudiante_ficha: number): Promise<number> {
    return this.model.destroy({ where: { id_estudiante_ficha } });
  }
}
