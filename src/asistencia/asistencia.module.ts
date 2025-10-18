import { forwardRef, Module } from '@nestjs/common';
import { AsistenciaService } from './asistencia.service';
import { AsistenciaController } from './asistencia.controller';
import { AsistenciaRepository } from './asistencia.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { asistencia } from 'src/models/asistencia.model';
import { HuellaMapModule } from 'src/huella_map/huella_map.module';
import { SensorClientService } from 'src/sensor-client/sensor-client.service';

@Module({
  imports: [
    SequelizeModule.forFeature([asistencia]),
    forwardRef(() => HuellaMapModule),
  ],
  providers: [AsistenciaService, AsistenciaRepository, SensorClientService],
  controllers: [AsistenciaController],
  exports: [AsistenciaService, AsistenciaRepository, SensorClientService],
})
export class AsistenciaModule {}
