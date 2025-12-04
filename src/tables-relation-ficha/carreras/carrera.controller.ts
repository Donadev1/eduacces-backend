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
import { CarreraService } from './carrera.service';
import { Roles } from 'src/auth/decorators/roles/roles.decorator';
import { Carrera } from 'src/models/carrera.model';
import { JwtAuthGuard } from 'src/auth/guard/auth/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles/roles.guard';
import { UpdateCarreraDto } from './dto/update.carrera';

@Controller('carreras')
export class CarreraController {
  constructor(private carreraService: CarreraService) {}

  @Get('metrica')
  async metric() {
    return this.carreraService.metric_carrera();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('directivo')
  @Post()
  async create(@Body() dto: Omit<Carrera, 'id_carrera'>) {
    return this.carreraService.createCarrera(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('directivo')
  @Get()
  async findAll() {
    return this.carreraService.getAllCarreras();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('directivo')
  @Get(':id_carrera')
  async findById(@Param('id_carrera', ParseIntPipe) id_carrera: number) {
    return this.carreraService.getCarreraById(id_carrera);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('directivo')
  @Put(':id_carrera')
  async Update(
    @Param('id_carrera', ParseIntPipe) id_carrera: number,
    @Body() dto: UpdateCarreraDto,
  ) {
    return this.carreraService.updateCarrera(id_carrera, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('directivo')
  @Delete(':id_carrera')
  async delete(@Param('id_carrera', ParseIntPipe) id_carrera: number) {
    return this.carreraService.deleteCarrera(id_carrera);
  }
}
