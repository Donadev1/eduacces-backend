import {
  Body,
  Controller,
  Get,
  Put,
  Delete,
  Post,
  UseGuards,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { FichaService } from './ficha.service';
import { JwtAuthGuard } from 'src/auth/guard/auth/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles/roles.guard';
import { Roles } from 'src/auth/decorators/roles/roles.decorator';
import { Ficha } from 'src/models/ficha.model';

@Controller('fichas')
export class FichaController {
  constructor(private fichaService: FichaService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('directivo')
  @Post()
  async create(@Body() dto: Omit<Ficha, 'id_ficha'>) {
    return this.fichaService.createFicha(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('directivo')
  @Get()
  async findAll() {
    return this.fichaService.getAllFichas();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('directivo')
  @Get(':id_ficha')
  async findById(@Param('id_ficha', ParseIntPipe) id_ficha: number) {
    return this.fichaService.getFichaById(id_ficha);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('directivo')
  @Put(':id_ficha')
  async Update(
    @Param('id_ficha', ParseIntPipe) id_ficha: number,
    @Body() dto: Pick<Ficha, 'numero_ficha'>,
  ) {
    return this.fichaService.updateFicha(id_ficha, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('directivo')
  @Delete(':id_ficha')
  async delete(@Param('id_ficha', ParseIntPipe) id_ficha: number) {
    return this.fichaService.deleteFicha(id_ficha);
  }
}
