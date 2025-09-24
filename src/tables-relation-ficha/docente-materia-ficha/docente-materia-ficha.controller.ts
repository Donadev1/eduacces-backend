import {
  Controller,
  UseGuards,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { DocenteMateriaFichaService } from './docente-materia-ficha.service';
import { DocenteMateriaFicha } from 'src/models/docente-materia-ficha.model';
import { JwtAuthGuard } from 'src/auth/guard/auth/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles/roles.guard';
import { Roles } from 'src/auth/decorators/roles/roles.decorator';

@Controller('docente-ficha')
export class DocenteMateriaFichaController {
  constructor(private readonly service: DocenteMateriaFichaService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('directivo')
  @Get()
  getAll() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('directivo')
  @Get(':id')
  getDocenteMateriaFicha(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('directivo')
  @Post()
  createDocenteMateriaFicha(
    @Body()
    dto: Omit<DocenteMateriaFicha, 'id_docente_materia_ficha'>,
  ) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('directivo')
  @Put(':id')
  updateDocenteMateriaFicha(
    @Param('id', ParseIntPipe) id: number,
    docenteMateriaFicha: Partial<
      Omit<DocenteMateriaFicha, 'id_docente_materia_ficha'>
    >,
  ) {
    return this.service.update(id, docenteMateriaFicha);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('directivo')
  @Delete(':id')
  deleteDocenteMateriaFicha(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
