import { Module } from '@nestjs/common';
import { PersonaService } from './persona.service';
import { PersonaController } from './persona.controller';
import { PersonaRepository } from './persona.repository';

@Module({
  
  providers: [PersonaService, PersonaRepository],
  controllers: [PersonaController]
})
export class PersonaModule {}
