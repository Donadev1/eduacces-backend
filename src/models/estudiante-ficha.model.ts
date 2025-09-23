import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { persona } from './persona.model';
import { Ficha } from './ficha.model';

interface AtributtesEstudianteFicha {
  id_estudiante_ficha?: number;
  id_persona: number;
  id_ficha: number;
}

@Table({
  tableName: 'estudiante_ficha',
  timestamps: false,
})
export class EstudianteFicha
  extends Model<AtributtesEstudianteFicha>
  implements AtributtesEstudianteFicha
{
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id_estudiante_ficha!: number;

  @ForeignKey(() => persona)
  @Column({
    type: DataType.INTEGER,
  })
  id_persona!: number;

  @ForeignKey(() => Ficha)
  @Column({
    type: DataType.INTEGER,
  })
  id_ficha!: number;

  @BelongsTo(() => Ficha)
  ficha!: Ficha;

  @BelongsTo(() => persona)
  persona!: persona;
}
