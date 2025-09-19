import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PersonaModule } from './persona/persona.module';
import { HuellaMapModule } from './huella_map/huella_map.module';
import { AsistenciaModule } from './asistencia/asistencia.module';
import { AccesoModule } from './acceso/acceso.module';
import { SensorClientService } from './sensor-client/sensor-client.service';
import { HuellasModule } from './huella/huella.module';
import { CarreraModule } from './carreras/carrera.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    PersonaModule,
    UserModule,
    HuellaMapModule,
    AsistenciaModule,
    AccesoModule,
    HuellasModule,
    CarreraModule,
  ],
  controllers: [AppController],
  providers: [AppService, SensorClientService],
})
export class AppModule {}
