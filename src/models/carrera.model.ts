import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface AtributtesCarrera {
  id_carrera: number;
  name: string;
  description: string;
}

@Table({
  tableName: 'carrera',
  timestamps: false,
})
export class Carrera
  extends Model<AtributtesCarrera>
  implements AtributtesCarrera
{
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id_carrera!: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  name!: string;
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description!: string;
}
