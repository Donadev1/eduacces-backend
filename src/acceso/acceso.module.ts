import { forwardRef, Module } from '@nestjs/common';
import { AccesoController } from './acceso.controller';
import { AccesoService } from './acceso.service';
import { AsistenciaService } from 'src/asistencia/asistencia.service';
import { HuellaMapService } from 'src/huella_map/huella_map.service';
import { persona } from 'src/models/persona.model';
import { HuellaMap } from 'src/models/hulla_map';
import { asistencia } from 'src/models/asistencia.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { PersonaModule } from 'src/persona/persona.module';
import { AsistenciaModule } from 'src/asistencia/asistencia.module';
import { HuellaMapModule } from 'src/huella_map/huella_map.module';

@Module({
  imports: [
    SequelizeModule.forFeature([asistencia, HuellaMap, persona]),
    forwardRef(() => HuellaMapModule),
    forwardRef(() => AsistenciaModule),
    forwardRef(() => PersonaModule),
    HuellaMapModule,
  ],
  controllers: [AccesoController],
  providers: [AccesoService, AsistenciaService, HuellaMapService],
})
export class AccesoModule {}
