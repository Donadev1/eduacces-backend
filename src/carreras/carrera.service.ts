import { Injectable } from '@nestjs/common';
import { CarreraRepository } from './carrera.repository';
import { Carrera } from 'src/models/carrera.model';

@Injectable()
export class CarreraService {
  constructor(private readonly carreraRepository: CarreraRepository) {}

  async getAllCarreras() {
    return this.carreraRepository.findAll();
  }

  async getCarreraById(id: number) {
    return this.carreraRepository.findById(id);
  }

  async createCarrera(carrera: Omit<Carrera, 'id_carrera'>) {
    return this.carreraRepository.create(carrera);
  }

  async updateCarrera(
    id_carrera: number,
    carrera: Partial<Omit<Carrera, 'id_carrera'>>,
  ) {
    return this.carreraRepository.update(carrera, {
      where: { id_carrera },
      returning: false,
    });
  }

  async deleteCarrera(id_carrera: number) {
    return this.carreraRepository.remove(id_carrera);
  }
}
