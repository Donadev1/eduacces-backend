import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { HuellaMapService } from './huella_map.service';
import { UpsertMappingDto } from './dto/Unsertp.dto';

@Controller('huella-map')
export class HuellaMapController {
  constructor(private readonly service: HuellaMapService) {}

  // GET /huella-map/sensor/23
  @Get('sensor/:id')
  async findBySensor(@Param('id', ParseIntPipe) id_sensor: number) {
    const row = await this.service.findBySensor(id_sensor);
    return row ?? { ok: false, message: 'No mapeado' };
  }

  // POST /huella-map
  // { "id_sensor": 23, "id_persona": 23 }
  @Post()
  @HttpCode(200)
  async upsert(@Body() dto: UpsertMappingDto) {
    const saved = await this.service.upsertMapping(
      dto.id_sensor,
      dto.id_persona,
    );
    return { ok: true, data: saved };
  }

  // DELETE /huella-map/persona/23
  @Delete('persona/:id')
  @HttpCode(200)
  async deleteByPersona(@Param('id', ParseIntPipe) id_persona: number) {
    const n = await this.service.deleteByPersona(id_persona);
    return { ok: true, deleted: n };
  }

  // PATCH /huella-map/sensor/23/seen
  @Patch('sensor/:id/seen')
  @HttpCode(200)
  async touch(@Param('id', ParseIntPipe) id_sensor: number) {
    await this.service.touchLastSeen(id_sensor);
    return { ok: true };
  }
}
