import { Module } from '@nestjs/common';
import { RelationsClassController } from './relations-class.controller';
import { RelationsClassService } from './relations-class.service';

@Module({
  controllers: [RelationsClassController],
  providers: [RelationsClassService]
})
export class RelationsClassModule {}
