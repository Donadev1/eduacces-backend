import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AccesoService } from './acceso.service';
import { EventoAccesoDto } from './dto/EventoAccesoDto';
import { Roles } from 'src/auth/decorators/roles/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guard/auth/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles/roles.guard';

@Controller('acceso')
export class AccesoController {
  constructor(private readonly service: AccesoService) {}

  @Post('evento')
  @HttpCode(HttpStatus.OK)
  async evento(
    @Body() dto: EventoAccesoDto,
    @Headers('x-device-key') deviceKey: string,
  ) {
    // valida deviceKey con process.env.DEVICE_KEY si lo usas
    return this.service.procesarPorSensor(dto.id_sensor);
  }
}
