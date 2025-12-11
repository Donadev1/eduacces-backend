import { Module } from '@nestjs/common';
import { CarreraController } from './carrera.controller';
import { CarreraRepository } from './carrera.repository';
import { CarreraService } from './carrera.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Carrera } from 'src/models/carrera.model';

@Module({
  imports: [SequelizeModule.forFeature([Carrera])],
  providers: [CarreraRepository, CarreraService],
  controllers: [CarreraController],
  exports: [CarreraService],
})
export class CarreraModule {}
