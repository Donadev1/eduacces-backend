import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DocenteMateriaFicha } from 'src/models/docente-materia-ficha.model';

@Injectable()
export class DocenteMateriaFichaService {
  constructor(
    @InjectModel(DocenteMateriaFicha)
    private readonly docenteMateriaFichaModel: typeof DocenteMateriaFicha,
  ) {}

  async findAll(): Promise<DocenteMateriaFicha[]> {
    return await this.docenteMateriaFichaModel.findAll();
  }

  async findOne(id: number): Promise<DocenteMateriaFicha | null> {
    return await this.docenteMateriaFichaModel.findByPk(id);
  }

  async create(
    docenteMateriaFicha: Omit<DocenteMateriaFicha, 'id_docente_materia_ficha'>,
  ): Promise<DocenteMateriaFicha> {
    return await this.docenteMateriaFichaModel.create(docenteMateriaFicha);
  }

  async update(
    id_docente_materia_ficha: number,
    docenteMateriaFicha: Partial<
      Omit<DocenteMateriaFicha, 'id_docente_materia_ficha'>
    >,
  ): Promise<number[]> {
    return await this.docenteMateriaFichaModel.update(docenteMateriaFicha, {
      where: {
        id_docente_materia_ficha,
      },
    });
  }

  async delete(id_docente_materia_ficha: number): Promise<number> {
    return await this.docenteMateriaFichaModel.destroy({
      where: {
        id_docente_materia_ficha,
      },
    });
  }
}
