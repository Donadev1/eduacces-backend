import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Carrera } from './carrera.model';

interface AtributtesFicha {
  id_ficha: number;
  numero_ficha: number;
  id_carrera: number;
}

@Table({
  tableName: 'ficha',
  timestamps: false,
})
export class Ficha extends Model<AtributtesFicha> implements AtributtesFicha {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id_ficha!: number;

  @Column({
    type: DataType.INTEGER,
  })
  numero_ficha!: number;
  @ForeignKey(() => Carrera)
  @Column({
    type: DataType.INTEGER,
  })
  id_carrera!: number;

  @BelongsTo(() => Carrera)
  carrera!: Carrera;
}
