import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { HuellaService } from './huella.service';

@Controller('huellas')
export class HuellasController {
  constructor(private readonly service: HuellaService) {}

  @Post('enroll')
  @HttpCode(200)
  enroll(@Body() dto: { id_persona: number }) {
    return this.service.enrroll(dto.id_persona);
  }

  @Post('delete')
  @HttpCode(200)
  remove(@Body() dto: { id_persona: number }) {
    return this.service.delete(dto.id_persona);
  }
}
