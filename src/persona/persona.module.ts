import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { persona } from 'src/models/persona.model';
import { rol } from 'src/models/rol.model';
import { PersonaRepository } from './persona.repository';
import { PersonaService } from './persona.service';
import { PersonaController } from './persona.controller';
import { AuthModule } from 'src/auth/auth.module';
import { HuellaMapService } from 'src/huella_map/huella_map.service';
import { SensorClientService } from 'src/sensor-client/sensor-client.service';
import { HuellaMap } from 'src/models/hulla_map';
import { HuellaMapModule } from 'src/huella_map/huella_map.module';

@Module({
  imports: [
    SequelizeModule.forFeature([persona, rol, HuellaMap]),
    forwardRef(() => AuthModule),
    forwardRef(() => HuellaMapModule),
    HuellaMapModule,
  ],
  providers: [
    PersonaRepository,
    PersonaService,
    HuellaMapService,
    SensorClientService,
  ],
  controllers: [PersonaController],
  exports: [PersonaRepository, PersonaService],
})
export class PersonaModule {}
