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
import { MateriaService } from './materias.service';
import { JwtAuthGuard } from 'src/auth/guard/auth/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles/roles.guard';
import { Roles } from 'src/auth/decorators/roles/roles.decorator';
import { Materias } from 'src/models/materias.model';

@Controller('materias')
export class MateriaController {
  constructor(private readonly materiaService: MateriaService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('directivo')
  @Get()
  findAll() {
    return this.materiaService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('directivo')
  @Get()
  findById(id: number) {
    return this.materiaService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('directivo')
  @Post()
  create(@Body() materia: Omit<Materias, 'id_materia'>) {
    return this.materiaService.create(materia);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('directivo')
  @Put(':id_materia')
  update(
    @Param('id_materia', ParseIntPipe) id: number,
    @Body() materia: Partial<Omit<Materias, 'id_materia'>>,
  ) {
    return this.materiaService.update(id, materia);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('directivo')
  @Delete(':id_materia')
  delete(@Param('id_materia', ParseIntPipe) id: number) {
    return this.materiaService.delete(id);
  }
}
