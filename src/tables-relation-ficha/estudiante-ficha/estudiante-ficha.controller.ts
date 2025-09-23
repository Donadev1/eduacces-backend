import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { EstudianteFichaService } from './estudiante-ficha.service';
import { JwtAuthGuard } from 'src/auth/guard/auth/auth.guard';
import { Roles } from 'src/auth/decorators/roles/roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles/roles.guard';
import { EstudianteFicha } from 'src/models/estudiante-ficha.model';

@Controller('estudiante-ficha')
export class EstudianteFichaController {
  constructor(private readonly service: EstudianteFichaService) {}

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
    dto: Omit<EstudianteFicha, 'id_estudiante_ficha'>,
  ) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('directivo')
  @Put(':id')
  updateEstudianteFicha(
    @Param('id', ParseIntPipe) id: number,
    dto: Partial<Omit<EstudianteFicha, 'id_estudiante_ficha'>>,
  ) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('directivo')
  @Delete(':id')
  deleteEstudianteFicha(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
