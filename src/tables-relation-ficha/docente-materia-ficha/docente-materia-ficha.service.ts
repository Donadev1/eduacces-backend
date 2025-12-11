import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions } from 'sequelize';
import { DocenteMateriaFicha } from 'src/models/docente-materia-ficha.model';
import { ResponseGeneral, TypeDataMetrics } from 'src/models/response.general';

@Injectable()
export class DocenteMateriaFichaService {
  constructor(
    @InjectModel(DocenteMateriaFicha)
    private readonly docenteMateriaFichaModel: typeof DocenteMateriaFicha,
  ) {}

  async metrics() {
    const data = await this.docenteMateriaFichaModel.count();

    const response: ResponseGeneral<TypeDataMetrics> = {
      success: true,
      data: {
        count: data,
      },
    };

    return response;
  }

  async findOne(id: number, options: Omit<FindOptions, 'where'> = {}) {
    return this.docenteMateriaFichaModel.findByPk(id, options);
  }

  async findAll(options: FindOptions) {
    return this.docenteMateriaFichaModel.findAll(options);
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
