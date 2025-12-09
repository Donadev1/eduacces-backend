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
