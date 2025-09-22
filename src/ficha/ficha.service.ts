import { Injectable } from '@nestjs/common';
import { FichaRepository } from './ficha.repository';
import { Ficha } from 'src/models/ficha.model';

@Injectable()
export class FichaService {
  constructor(private readonly fichaRepository: FichaRepository) {}

  async getAllFichas() {
    return this.fichaRepository.findAllFichas();
  }

  async getFichaById(id: number) {
    return this.fichaRepository.findById(id);
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
