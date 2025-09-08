import { forwardRef, Module } from '@nestjs/common';
import { HuellaMapController } from './huella_map.controller';
import { HuellaMapService } from './huella_map.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { HuellaMap } from 'src/models/hulla_map';
import { HuellaMapRepository } from './huella_map.repository';
import { AsistenciaModule } from 'src/asistencia/asistencia.module';
import { PersonaModule } from 'src/persona/persona.module';
import { asistencia } from 'src/models/asistencia.model';
import { persona } from 'src/models/persona.model';

@Module({
  imports: [
    SequelizeModule.forFeature([HuellaMap, asistencia, persona]),
    forwardRef(() => AsistenciaModule),
    forwardRef(() => PersonaModule),
  ],
  controllers: [HuellaMapController],
  providers: [HuellaMapService, HuellaMapRepository],
  exports: [HuellaMapService, HuellaMapRepository],
})
export class HuellaMapModule {}
