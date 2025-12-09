import { Optional } from 'sequelize';
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Persona } from './persona.model';

interface RolAttributes {
  id_rol: number;
  nombre: string;
}

interface RolCreationAttributes extends Optional<RolAttributes, 'id_rol'> {}

@Table({
  tableName: 'rol',
  timestamps: false,
})
export class Rol
  extends Model<RolAttributes, RolCreationAttributes>
  implements RolAttributes
{
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id_rol: number;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare nombre: string;

  @HasMany(() => Persona, { foreignKey: 'id_rol', as: 'personas' })
  declare personas?: Persona[];
}
