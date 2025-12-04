import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AsistenciaService } from './asistencia.service';

@Controller('asistencia')
export class AsistenciaController {
  constructor(private service: AsistenciaService) {}

  @Post()
  @HttpCode(200)
  registerAccess() {
    return this.service.registerAccess();
  }

  @Post('salida')
  @HttpCode(200)
  registerExit() {
    return this.service.marcarSalida();
  }
}
