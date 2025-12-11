import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Persona } from './persona.model';
import { Ficha } from './ficha.model';
import { Materias } from './materias.model';

interface AtributtesDocenteMateriaFicha {
  id_docente_materia_ficha?: number;
  id_persona: number;
  id_materia: number;
  id_ficha: number;
}

@Table({
  tableName: 'docente_materia_ficha',
  timestamps: false,
})
export class DocenteMateriaFicha
  extends Model<AtributtesDocenteMateriaFicha>
  implements AtributtesDocenteMateriaFicha
{
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id_docente_materia_ficha!: number;

  @ForeignKey(() => Persona)
  @Column({
    type: DataType.INTEGER,
  })
  id_persona!: number;

  @ForeignKey(() => Materias)
  @Column({
    type: DataType.INTEGER,
  })
  id_materia!: number;

  @ForeignKey(() => Ficha)
  @Column({
    type: DataType.INTEGER,
  })
  id_ficha!: number;

  @BelongsTo(() => Persona)
  persona!: Persona;

  @BelongsTo(() => Materias)
  materia!: Materias;

  @BelongsTo(() => Ficha)
  ficha!: Ficha;
}
