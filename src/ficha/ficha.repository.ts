import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, UpdateOptions } from 'sequelize';
import { Ficha, AtributtesFicha } from 'src/models/ficha.model';

export class FichaRepository {
  constructor(@InjectModel(Ficha) private fichaModel: typeof Ficha) {}

  metrics() {
    return this.fichaModel.count();
  }

  findAllFichas(): Promise<Ficha[]> {
    return this.fichaModel.findAll({
      attributes: ['numero_ficha', 'id_carrera'],
    });
  }

  findById(id_ficha: number, options: Omit<FindOptions, 'where'> = {}) {
    return this.fichaModel.findByPk(id_ficha, options);
  }

  createFicha(ficha: Omit<Ficha, 'id_ficha'>) {
    return this.fichaModel.create(ficha);
  }

  updateFicha(
    ficha: Pick<Ficha, 'numero_ficha'>,
    options: UpdateOptions<AtributtesFicha>,
  ): Promise<number[]> {
    return this.fichaModel.update(ficha, options);
  }

  deleteFicha(id_ficha: number): Promise<number> {
    return this.fichaModel.destroy({
      where: { id_ficha },
    });
  }
}
