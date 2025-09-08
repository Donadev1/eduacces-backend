import { Optional } from 'sequelize';
import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  HasOne,
  HasMany,
} from 'sequelize-typescript';
import { rol } from './rol.model';
import { HuellaMap } from './hulla_map';
import { asistencia } from './asistencia.model';

interface personaAttributes {
  id_persona: number;
  documento: string;
  nombre: string;
  apellido: string;
  correo?: string;
  telefono?: string;
  id_rol: number;
}

interface personaCreationAttributes
  extends Optional<personaAttributes, 'id_persona'> {}

@Table({
  tableName: 'persona',
  timestamps: false,
})
export class persona
  extends Model<personaAttributes, personaCreationAttributes>
  implements personaAttributes
{
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id_persona: number;

  @Column({ type: DataType.STRING(20), allowNull: false })
  declare documento: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare nombre: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare apellido: string;

  @Column({ type: DataType.STRING(100), allowNull: true })
  declare correo?: string;

  @Column({ type: DataType.STRING(20), allowNull: true })
  declare telefono?: string;

  @ForeignKey(() => rol)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare id_rol: number;

  @BelongsTo(() => rol, { as: 'rol', foreignKey: 'id_rol' })
  declare rol?: rol;

  @HasOne(() => HuellaMap, { foreignKey: 'id_persona' })
  declare huella_map?: HuellaMap;

  @HasMany(() => asistencia, { foreignKey: 'id_persona' })
  declare asistencias?: asistencia[];
}
