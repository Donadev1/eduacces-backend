import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Carrera } from './carrera.model';
import { persona } from './persona.model';
import { Subjects } from './subjects.model';
import { Ficha } from './ficha.model';

interface AtributtesDocenteMateriaFicha {
  id_docente_materia_ficha?: number;
  id_persona: number;
  id_materia: number;
  id_ficha: number;
}

@Table({
  tableName: 'ficha',
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

  @ForeignKey(() => persona)
  @Column({
    type: DataType.INTEGER,
  })
  id_persona!: number;

  @ForeignKey(() => Subjects)
  @Column({
    type: DataType.INTEGER,
  })
  id_materia!: number;

  @ForeignKey(() => Ficha)
  @Column({
    type: DataType.INTEGER,
  })
  id_ficha!: number;

  @BelongsTo(() => Carrera)
  carrera!: Carrera;
}
