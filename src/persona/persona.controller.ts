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
import { PersonaService } from './persona.service';
import { CreatePersonaDto } from './dto/create.persona.dto';
import { Roles } from 'src/auth/decorators/roles/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guard/auth/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles/roles.guard';
import { UpdatePersonaDto } from './dto/update.persona.dto';

@Controller('persona')
export class PersonaController {
  constructor(private readonly personaService: PersonaService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('directivo')
  @Post()
  async create(@Body() dto: CreatePersonaDto) {
    return this.personaService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('directivo')
  @Get()
  async findAll() {
    return this.personaService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('directivo')
  @Get(':id_persona')
  async findById(@Param('id_persona', ParseIntPipe) id_persona: number) {
    return this.personaService.findById(id_persona);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('directivo')
  @Put(':id_persona')
  async Update(
    @Param('id_persona', ParseIntPipe) id_persona: number,
    @Body() dto: UpdatePersonaDto,
  ) {
    return this.personaService.update(id_persona, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('directivo')
  @Delete(':id_persona')
  async delete(@Param('id_persona', ParseIntPipe) id_persona: number) {
    return this.personaService.remove(id_persona);
  }
}
