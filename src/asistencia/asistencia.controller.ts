import {
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AsistenciaService } from './asistencia.service';
import { Roles } from 'src/auth/decorators/roles/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guard/auth/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles/roles.guard';

@Controller('asistencia')
export class AsistenciaController {
  constructor(private service: AsistenciaService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('directivo')
  @Get(':id_persona')
  getUltiAttendace(@Param('id_persona', ParseIntPipe) id_persona: number) {
    return this.service.findByPk(id_persona);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('directivo')
  @Post()
  @HttpCode(200)
  registerAccess() {
    return this.service.registerAccess();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('directivo')
  @Post('salida')
  @HttpCode(200)
  registerExit() {
    return this.service.marcarSalida();
  }
}
