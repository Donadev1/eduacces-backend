import { forwardRef, Module } from '@nestjs/common';
import { AsistenciaService } from './asistencia.service';
import { AsistenciaController } from './asistencia.controller';
import { AsistenciaRepository } from './asistencia.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { asistencia } from 'src/models/asistencia.model';
import { HuellaMapModule } from 'src/huella_map/huella_map.module';

@Module({
  imports: [
    SequelizeModule.forFeature([asistencia]),
    forwardRef(() => HuellaMapModule),
  ],
  providers: [AsistenciaService, AsistenciaRepository],
  controllers: [AsistenciaController],
  exports: [AsistenciaService, AsistenciaRepository],
})
export class AsistenciaModule {}
