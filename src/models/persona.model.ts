import { Optional } from 'sequelize';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { rol } from './rol.model';

interface personaAttributes {
  id_persona: number;
  documento: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
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

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare nombre: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare apellido: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare correo: string;

  @Column({ type: DataType.STRING(15), allowNull: false })
  declare telefono: string;

  @ForeignKey(() => rol)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare id_rol: number;

  @BelongsTo(() => rol)
  rol: rol;
}
