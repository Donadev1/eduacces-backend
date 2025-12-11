import { Module } from '@nestjs/common';
import { RelationsClassController } from './relations-class.controller';
import { RelationsClassService } from './relations-class.service';
import { FichaModule } from 'src/ficha/ficha.module';
import { CarreraModule } from '../carreras/carrera.module';
import { DocenteMateriaFichaModule } from '../docente-materia-ficha/docente-materia-ficha.module';
import { EstudianteFichaModule } from '../estudiante-ficha/estudiante-ficha.module';
import { MateriaModule } from '../materias/materias.module';

@Module({
  imports: [
    FichaModule,
    CarreraModule,
    DocenteMateriaFichaModule,
    EstudianteFichaModule,
    MateriaModule,
  ],
  controllers: [RelationsClassController],
  providers: [RelationsClassService],
})
export class RelationsClassModule {}
