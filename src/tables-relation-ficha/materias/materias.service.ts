import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Materias } from 'src/models/materias.model';

@Injectable()
export class MateriaService {
  constructor(
    @InjectModel(Materias) private readonly materiasModel: typeof Materias,
  ) {}

  async findAll(): Promise<Materias[]> {
    return this.materiasModel.findAll();
  }

  async findById(id: number): Promise<Materias | null> {
    return this.materiasModel.findByPk(id);
  }

  async create(materia: Omit<Materias, 'id_materia'>): Promise<Materias> {
    return this.materiasModel.create(materia);
  }

  async update(
    id_materia: number,
    materia: Partial<Omit<Materias, 'id_materia'>>,
  ): Promise<number[]> {
    return this.materiasModel.update(materia, {
      where: { id_materia },
    });
  }

  async delete(id: number): Promise<number> {
    return this.materiasModel.destroy({ where: { id_materia: id } });
  }
}
