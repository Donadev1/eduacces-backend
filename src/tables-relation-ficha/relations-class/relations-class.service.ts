import { Injectable, NotFoundException } from '@nestjs/common';
import { FichaService } from 'src/ficha/ficha.service';
import { MateriaService } from '../materias/materias.service';
import { DocenteMateriaFichaService } from '../docente-materia-ficha/docente-materia-ficha.service';
import { EstudianteFichaService } from '../estudiante-ficha/estudiante-ficha.service';
import { FindOptions, Op, Sequelize } from 'sequelize';
import { Carrera } from 'src/models/carrera.model';
import { Persona } from 'src/models/persona.model';
import { Materias } from 'src/models/materias.model';
import { Ficha } from 'src/models/ficha.model';
import {
  ResponseGeneral,
  TypeDatasRelationClass,
} from 'src/models/response.general';

@Injectable()
export class RelationsClassService {
  constructor(
    private readonly fichaService: FichaService,
    private readonly docente_materiaService: DocenteMateriaFichaService,
    private readonly materiaService: MateriaService,
    private readonly estudiante_service: EstudianteFichaService,
  ) {}

  async getFicha(id_ficha: number) {
    const options_docent: Omit<FindOptions, 'where'> = {
      include: [
        {
          model: Persona,
          attributes: ['documento', 'nombre', 'apellido', 'correo', 'telefono'],
        },
        {
          model: Materias,
          attributes: ['nombre', 'tipo'],
        },
        {
          model: Ficha,
          attributes: {
            exclude: ['id_ficha', 'id_carrera'],
          },
          include: [
            {
              model: Carrera,
              attributes: ['nombre'],
            },
          ],
        },
      ],
      raw: true,
      nest: true,
    };

    const docente_materia = await this.docente_materiaService.findOne(
      id_ficha,
      options_docent,
    );

    const options_materias: FindOptions = {
      raw: true,
      nest: true,
      where: Sequelize.where(Sequelize.col('ficha.id_ficha'), Op.eq, id_ficha),
      attributes: [],
      include: [
        {
          model: Ficha,
          attributes: {
            exclude: ['id_ficha', 'id_carrera'],
          },
        },
        {
          model: Materias,
          attributes: ['nombre', 'tipo'],
        },
      ],
    };

    const materias =
      await this.docente_materiaService.findAll(options_materias);

    const ficha_data = await this.fichaService.getFichaById(id_ficha, {
      attributes: {
        exclude: ['id_carrera'],
      },
    });

    if (!docente_materia || !ficha_data) {
      throw new NotFoundException('Ficha not found');
    }

    const options_estudiante: FindOptions = {
      where: { id_ficha },
      attributes: {
        exclude: ['id_ficha', 'id_persona'],
      },
      include: [
        {
          model: Persona,
          attributes: { exclude: ['id_persona', 'id_rol'] },
        },
      ],
    };

    const estudiante =
      await this.estudiante_service.findAll(options_estudiante);

    const response: ResponseGeneral<TypeDatasRelationClass> = {
      success: true,
      data: {
        ficha: ficha_data,
        carrera: docente_materia.ficha.carrera,
        materias: materias.map((value) => value.materia),
        docente: docente_materia.persona,
        estudiantes: estudiante,
      },
    };

    return response;
  }
}
