import { Column, DataType, Model, Table } from 'sequelize-typescript';

export interface AtributtesMaterias {
  id_materia?: number;
  nombre: string;
  tipo: string;
}

@Table({
  tableName: 'materia',
  timestamps: false,
})
export class Materias
  extends Model<AtributtesMaterias>
  implements AtributtesMaterias
{
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id_materia!: number;

  @Column({
    type: DataType.TEXT,
  })
  nombre!: string;

  @Column({
    type: DataType.TEXT,
  })
  tipo!: string;
}
