import { Module } from '@nestjs/common';
import { MateriaController } from './materias.controller';
import { MateriaService } from './materias.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Materias } from 'src/models/materias.model';

@Module({
  imports: [SequelizeModule.forFeature([Materias])],
  controllers: [MateriaController],
  providers: [MateriaService],
})
export class MateriaModule {}
