import { Module } from '@nestjs/common';
import { DocenteMateriaFichaController } from './docente-materia-ficha.controller';
import { DocenteMateriaFichaService } from './docente-materia-ficha.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { DocenteMateriaFicha } from 'src/models/docente-materia-ficha.model';

@Module({
  imports: [SequelizeModule.forFeature([DocenteMateriaFicha])]
  controllers: [DocenteMateriaFichaController],
  providers: [DocenteMateriaFichaService]
})
export class DocenteMateriaFichaModule {}
