import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { persona } from './persona.model';

interface asistenciaAttributes {
  id_asistencia?: number;
  id_persona: number;
  fecha: Date;
  hora_entrada?: string;
  hora_salida?: string;
  estado?: string;
}

@Table({
  tableName: 'asistencia',
  timestamps: false,
})
export class asistencia
  extends Model<asistenciaAttributes>
  implements asistenciaAttributes
{
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id_asistencia: number;

  @ForeignKey(() => persona)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id_persona!: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  fecha!: Date;

  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  hora_entrada?: string;

  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  hora_salida?: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  estado?: string;

  // Relación con persona
  @BelongsTo(() => persona)
  persona?: persona;
}
