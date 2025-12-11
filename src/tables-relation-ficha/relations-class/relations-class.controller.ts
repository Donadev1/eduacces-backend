import { Controller, Get, Param } from '@nestjs/common';
import { RelationsClassService } from './relations-class.service';

@Controller('relations-class')
export class RelationsClassController {
  constructor(private service: RelationsClassService) {}

  @Get(':id_ficha')
  getRelationsClass(@Param('id_ficha') id_ficha: number) {
    return this.service.getFicha(id_ficha);
  }
}
