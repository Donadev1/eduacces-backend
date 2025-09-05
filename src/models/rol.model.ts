import { Optional } from 'sequelize';
import { Column, DataType, HasOne, Model, Table } from 'sequelize-typescript';
import { persona } from './persona.model';

interface rolAttributes {
  id_rol: number;
  nombre: string;
}

interface rolCreationAttributes extends Optional<rolAttributes, 'id_rol'> {}

@Table({
  tableName: 'rol',
  timestamps: false,
})
export class rol
  extends Model<rolAttributes, rolCreationAttributes>
  implements rolAttributes
{
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id_rol: number;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare nombre: string;

  @HasOne(() => persona, { foreignKey: 'id_rol' })
  declare persona?: persona;
}
