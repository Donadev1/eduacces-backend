import { InjectModel } from '@nestjs/sequelize';
import { CreateOptions, UpdateOptions } from 'sequelize';
import { AtributtesCarrera, Carrera } from 'src/models/carrera.model';
import { ResponseGeneral, TypeDataMetrics } from 'src/models/response.general';

export class CarreraRepository {
  constructor(
    @InjectModel(Carrera)
    private carrera: typeof Carrera,
  ) {}

  async findAll(): Promise<Carrera[]> {
    return this.carrera.findAll();
  }

  async findById(id: number) {
    return this.carrera.findByPk(id);
  }

  async create(
    carrera: Omit<Carrera, 'id_carrera'>,
    options?: CreateOptions,
  ): Promise<Carrera> {
    return this.carrera.create(carrera, options);
  }

  async update(
    carrera: Partial<Omit<Carrera, 'id_carrera'>>,
    options: UpdateOptions<AtributtesCarrera>,
  ): Promise<[number]> {
    return this.carrera.update(carrera, options);
  }

  async remove(id_carrera: number): Promise<number> {
    return this.carrera.destroy({
      where: { id_carrera },
    });
  }

  async metric_repository() {
    const data = await this.carrera.count();

    const response: ResponseGeneral<TypeDataMetrics> = {
      success: true,
      data: {
        count: data,
      },
    };

    return response;
  }
}
