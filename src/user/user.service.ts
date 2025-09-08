// users/users.service.ts
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './user.repository';
import { CreateUserDto } from './dto/create.user.dto';
import { PersonaRepository } from 'src/persona/persona.repository';
import { UpdateUserDto } from './dto/update.user.dto';

@Injectable()
export class UsersService {
  constructor(
    private userRepository: UsersRepository,
    private readonly personaRepository: PersonaRepository,
  ) {}

  //VALIDACIONES
  findByCorreoWithPersonaRol(correo: string) {
    return this.userRepository.findByCorreoWithPersonaRol(correo);
  }

  async validatePassword(raw: string, hash: string) {
    return bcrypt.compare(raw, hash);
  }

  //BUSCAR USERS
  async findById(id_user: number) {
    return this.userRepository.findById(id_user);
  }
  async findAll() {
    return this.userRepository.findAll();
  }

  //CREAR USERS
  async create(dto: CreateUserDto) {
    try {
      const exist = await this.findByCorreoWithPersonaRol(dto.correo);
      if (exist) {
        throw new Error('El correo ya esta registrado');
      }
      const PersonaExist = await this.personaRepository.findByIdWithRol(
        dto.id_persona,
      );
      if (!PersonaExist) {
        throw new Error('La persona no existe');
      }
      const hash = await bcrypt.hash(dto.password, 10);

      const nuevo = await this.userRepository.create({
        correo: dto.correo.trim().toLowerCase(),
        password: hash,
        id_persona: dto.id_persona,
        estado: dto.estado ?? true,
      });

      return {
        id_user: nuevo.id_user,
        correo: nuevo.correo,
        id_persona: nuevo.id_persona,
        estado: nuevo.estado,
        persona: {
          id_persona: PersonaExist.id_persona,
          nombre: PersonaExist.nombre,
          apellido: PersonaExist.apellido,
          rol: PersonaExist.rol?.nombre,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  //ACTUALIZAR USERS
  async update(id_user: number, dto: UpdateUserDto) {
    try {
      const exist = await this.findById(id_user);
      if (!exist) {
        throw new Error('El usuario no existe');
      }

      const PersonaExist = await this.personaRepository.findByIdWithRol(
        dto.id_persona ?? exist.id_persona,
      );
      if (!PersonaExist) {
        throw new Error('La persona no existe');
      }

      const updateUser = await this.userRepository.update(dto, id_user);

      return updateUser;
    } catch (error) {
      throw error;
    }
  }

  //ELIMINAR USERS
  async remove(id_user: number) {
    try {
      const exist = await this.findById(id_user);
      if (!exist) {
        throw new Error('El usuario no existe');
      }
      await this.userRepository.remove(id_user);
      return true;
    } catch (error) {
      throw error;
    }
  }
}
