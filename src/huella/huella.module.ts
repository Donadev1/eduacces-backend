import { Module } from '@nestjs/common';
import { HuellasController } from './huella.controller';
import { HuellaService } from './huella.service';
import { HuellaMapModule } from 'src/huella_map/huella_map.module';
import { HuellaMapService } from 'src/huella_map/huella_map.service';
import { SensorClientService } from 'src/sensor-client/sensor-client.service';

@Module({
  imports: [HuellaMapModule],
  controllers: [HuellasController],
  providers: [HuellaService, HuellaMapService, SensorClientService],
})
export class HuellasModule {}
