import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Ficha } from 'src/models/ficha.model';
import { FichaRepository } from './ficha.repository';
import { FichaService } from './ficha.service';
import { FichaController } from './ficha.controller';

@Module({
  imports: [SequelizeModule.forFeature([Ficha])],
  providers: [FichaRepository, FichaService],
  controllers: [FichaController],
  exports: [FichaRepository, FichaService],
})
export class FichaModule {}
