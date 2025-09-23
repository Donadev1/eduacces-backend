import { Module } from '@nestjs/common';
import { EstudianteFichaController } from './estudiante-ficha.controller';
import { EstudianteFichaService } from './estudiante-ficha.service';
import { EstudianteFicha } from 'src/models/estudiante-ficha.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([EstudianteFicha])],
  controllers: [EstudianteFichaController],
  providers: [EstudianteFichaService],
})
export class EstudianteFichaModule {}
