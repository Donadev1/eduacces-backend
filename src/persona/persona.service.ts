import { Injectable, NotFoundException } from '@nestjs/common';
import { PersonaRepository } from './persona.repository';
import { CreatePersonaDto } from './dto/create.persona.dto';
import { persona } from 'src/models/persona.model';
import { UpdatePersonaDto } from './dto/update.persona.dto';

@Injectable()
export class PersonaService {
  constructor(private readonly personaRepository: PersonaRepository) {}

  async findAll(): Promise<persona[]> {
    return this.personaRepository.findAll();
  }

  async findById(id_persona: number): Promise<persona> {
    const user = await this.personaRepository.findById(id_persona);
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id_persona} no encontrado`);
    }
    return user;
  }

  async findByDocumento(documento: string) {
    return this.personaRepository.findByDocumento(documento);
  }

  async findByCorreo(correo: string) {
    const existing = await this.personaRepository.findByCorreo(correo);
    if (!existing) {
      throw new NotFoundException(`Usuario con correo ${correo} no encontrado`);
    }
  }

  async create(createpersona: CreatePersonaDto): Promise<persona> {
    try {
      const ExistingPersona = await this.findByDocumento(
        createpersona.documento,
      );
      if (ExistingPersona) {
        throw new NotFoundException(
          `Usuario con documento ${createpersona.documento} ya existe`,
        );
      }
      return this.personaRepository.create(createpersona);
    } catch (error) {
      throw error;
    }
  }

  async update(
    id_persona: number,
    updatepersona: UpdatePersonaDto,
  ): Promise<persona | null> {
    try {
      const exisnting = await this.findById(id_persona);
      if (!exisnting) {
        throw new NotFoundException(
          `Usuario con ID ${id_persona} no encontrado`,
        );
      }

      return this.personaRepository.update(id_persona, updatepersona);
    } catch (error) {
      throw error;
    }
  }

  async remove(id_persona: number): Promise<boolean> {
    const existing = await this.findById(id_persona);
    if (!existing) {
      throw new NotFoundException(`Usuario con ID ${id_persona} no encontrado`);
    }

    return await this.personaRepository.remove(id_persona);
  }
}
