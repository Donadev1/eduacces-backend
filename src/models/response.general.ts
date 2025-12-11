import { Carrera } from './carrera.model';
import { EstudianteFicha } from './estudiante-ficha.model';
import { Ficha } from './ficha.model';
import { Materias } from './materias.model';
import { Persona } from './persona.model';

export class ResponseGeneral<T> {
  success: boolean;
  data: T | null;
}

export class TypeDataMetrics {
  count: number;
}

export class TypeDatasFichaCreate {
  id_ficha: number;
  numero_ficha: number;
  id_carrera: number;
}

export class TypeDatasRelationClass {
  ficha: Ficha;
  carrera: Carrera;
  docente: Persona;
  materias: Materias[];
  estudiantes: EstudianteFicha[];
}
