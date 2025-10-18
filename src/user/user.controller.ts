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
import { UsersService } from './user.service';
import { RolesGuard } from 'src/auth/guard/roles/roles.guard';
import { JwtAuthGuard } from 'src/auth/guard/auth/auth.guard';
import { Roles } from 'src/auth/decorators/roles/roles.decorator';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  // Metodos de mostrar Users

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('directivo')
  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('directivo')
  @Get(':id_user')
  async findById(@Param('id_user', ParseIntPipe) id_user: number) {
    return this.userService.findById(id_user);
  }

  // Fin Metodos de mostrar Users

  // crear Users
  // commenta los dos primeros decorators para que no se requiera autenticacion y asi crear un usuario nuevo
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('directivo')
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }
  // Fin crear Users

  //Actualizar Users

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('directivo')
  @Put(':id_user')
  async Update(
    @Param('id_user', ParseIntPipe) id_user: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.update(id_user, dto);
  }

  // Fin Actualizar Users

  //Eliminar Users

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('directivo')
  @Delete(':id_user')
  async delete(@Param('id_user', ParseIntPipe) id_user: number) {
    return this.userService.remove(id_user);
  }
  // Fin Eliminar Users
}
