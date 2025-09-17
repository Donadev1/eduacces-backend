import { Column, DataType, Model, Table } from 'sequelize-typescript';

export interface AtributtesCarrera {
  id_carrera?: number;
  nombre: string;
  descripcion: string;
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
  nombre!: string;
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  descripcion!: string;
}
