import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Carrera } from 'src/models/carrera.model';
import { DocenteMateriaFicha } from 'src/models/docente-materia-ficha.model';
import { Ficha } from 'src/models/ficha.model';
import { Materias } from 'src/models/materias.model';
import { Persona } from 'src/models/persona.model';

@Injectable()
export class DocenteMateriaFichaService {
  constructor(
    @InjectModel(DocenteMateriaFicha)
    private readonly docenteMateriaFichaModel: typeof DocenteMateriaFicha,
  ) {}

  async findAll(): Promise<DocenteMateriaFicha[]> {
    return this.docenteMateriaFichaModel.findAll({
      attributes: {
        exclude: [
          'id_ficha',
          'id_materias',
          'id_persona',
          'id_docente_materia_ficha',
          'id_materia',
        ],
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
        { model: Persona, attributes: { exclude: ['id_persona', 'id_rol'] } },
        { model: Materias, attributes: { exclude: ['id_materia'] } },
      ],
    });
  }

  async findOne(id: number): Promise<DocenteMateriaFicha | null> {
    return this.docenteMateriaFichaModel.findByPk(id, {
      attributes: {
        exclude: [
          'id_ficha',
          'id_materias',
          'id_persona',
          'id_docente_materia_ficha',
          'id_materia',
        ],
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
        { model: Persona, attributes: { exclude: ['id_persona', 'id_rol'] } },
        { model: Materias, attributes: { exclude: ['id_materia'] } },
      ],
    });
  }

  async create(
    docenteMateriaFicha: Omit<DocenteMateriaFicha, 'id_docente_materia_ficha'>,
  ): Promise<DocenteMateriaFicha> {
    return this.docenteMateriaFichaModel.create(docenteMateriaFicha);
  }

  async update(
    id_docente_materia_ficha: number,
    docenteMateriaFicha: Partial<
      Omit<DocenteMateriaFicha, 'id_docente_materia_ficha'>
    >,
  ): Promise<number[]> {
    return this.docenteMateriaFichaModel.update(docenteMateriaFicha, {
      where: {
        id_docente_materia_ficha,
      },
    });
  }

  async delete(id_docente_materia_ficha: number): Promise<number> {
    return this.docenteMateriaFichaModel.destroy({
      where: {
        id_docente_materia_ficha,
      },
    });
  }
}
