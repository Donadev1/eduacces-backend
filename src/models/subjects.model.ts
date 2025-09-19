import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface AtributtesSubjects {
  id_subject: number;
  name: string;
  type: string;
}

@Table({
  tableName: 'materia',
  timestamps: false,
})
export class Subjects
  extends Model<AtributtesSubjects>
  implements AtributtesSubjects
{
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id_subject!: number;

  @Column({
    type: DataType.TEXT,
  })
  name!: string;
  @Column({
    type: DataType.TEXT,
  })
  type!: string;
}
