import { Optional } from 'sequelize';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { persona } from './persona.model';

interface HuellaMapAttributes {
  id_sensor: number;
  id_persona: number;
  fecha_registro: Date;
  last_seen: Date;
}

interface HuellaMapCreationAttributtes
  extends Optional<HuellaMapAttributes, 'id_sensor'> {}

@Table({
  tableName: 'huella_map',
  timestamps: false,
})
export class HuellaMap
  extends Model<HuellaMapAttributes, HuellaMapCreationAttributtes>
  implements HuellaMapAttributes
{
  @Column({ primaryKey: true, autoIncrement: true })
  declare id_sensor: number;
  @ForeignKey(() => persona)
  declare id_persona: number;
  @Column({ type: DataType.DATE, allowNull: false })
  declare fecha_registro: Date;
  @Column({ type: DataType.DATE, allowNull: false })
  declare last_seen: Date;

  @BelongsTo(() => persona, { foreignKey: 'id_persona', as: 'persona' })
  declare persona?: persona;
}
