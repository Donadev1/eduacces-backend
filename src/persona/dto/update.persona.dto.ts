import { CreatePersonaDto } from './create.persona.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdatePersonaDto extends PartialType(CreatePersonaDto) {}
