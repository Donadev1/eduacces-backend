import { Optional } from 'sequelize';
import {
  Column,
  DataType,
  ForeignKey,
  Table,
  Model,
  BelongsTo,
} from 'sequelize-typescript';
import { Persona } from './persona.model';

interface UsersAttributtes {
  id_user: number;
  correo: string;
  password: string;
  id_persona: number;
  estado?: boolean;
}

interface UsersCreationAttributes
  extends Optional<UsersAttributtes, 'id_user'> {}

@Table({
  tableName: 'users',
  timestamps: false,
})
export class Users
  extends Model<UsersAttributtes, UsersCreationAttributes>
  implements UsersAttributtes
{
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id_user: number;
  @Column({ type: DataType.STRING(100), allowNull: false })
  declare correo: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare password: string;

  @ForeignKey(() => Persona)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare id_persona: number;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: false })
  declare estado?: boolean;

  @BelongsTo(() => Persona, { as: 'persona' })
  declare persona?: Persona;
}
