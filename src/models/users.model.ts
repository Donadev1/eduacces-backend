import { Optional } from 'sequelize';
import {
  Column,
  DataType,
  ForeignKey,
  Table,
  Model,
} from 'sequelize-typescript';
import { persona } from './persona.model';

interface usersAttributtes {
  id_user: number;
  correo: string;
  password: string;
  id_persona: number;
  estado?: boolean;
}

interface usersCreationAttributes
  extends Optional<usersAttributtes, 'id_user'> {}

@Table({
  tableName: 'users',
  timestamps: false,
})
export class users
  extends Model<usersAttributtes, usersCreationAttributes>
  implements usersAttributtes
{
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id_user: number;
  @Column({ type: DataType.STRING(100), allowNull: false })
  declare correo: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare password: string;

  @ForeignKey(() => persona)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare id_persona: number;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: false })
  declare estado?: boolean;
}
