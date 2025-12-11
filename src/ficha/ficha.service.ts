import { Injectable } from '@nestjs/common';
import { FichaRepository } from './ficha.repository';
import { Ficha } from 'src/models/ficha.model';
import {
  ResponseGeneral,
  TypeDataMetrics,
  TypeDatasFichaCreate,
} from 'src/models/response.general';
import { FindOptions } from 'sequelize';

@Injectable()
export class FichaService {
  constructor(private readonly fichaRepository: FichaRepository) {}

  async getMetrics() {
    const data = await this.fichaRepository.metrics();

    const response: ResponseGeneral<TypeDataMetrics> = {
      success: true,
      data: {
        count: data,
      },
    };

    return response;
  }

  async getAllFichas() {
    return this.fichaRepository.findAllFichas();
  }

  async getFichaById(id: number, options: Omit<FindOptions, 'where'> = {}) {
    return this.fichaRepository.findById(id, options);
  }

  async createFicha(carrera: Omit<Ficha, 'id_ficha'>) {
    return this.fichaRepository.createFicha(carrera);
  }

  async updateFicha(id_ficha: number, ficha: Pick<Ficha, 'numero_ficha'>) {
    return this.fichaRepository.updateFicha(ficha, {
      where: { id_ficha },
      returning: false,
    });
  }

  async deleteFicha(id_carrera: number) {
    return this.fichaRepository.deleteFicha(id_carrera);
  }
}
