import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { asistencia } from 'src/models/asistencia.model';

@Injectable()
export class AsistenciaRepository {
  constructor(@InjectModel(asistencia) private model: typeof asistencia) {}

  findLastOfDay(id_persona: number, fechaISO: Date) {
    return this.model.findOne({
      where: { id_persona, fecha: fechaISO },
      order: [['id_asistencia', 'DESC']],
    });
  }

  createEntrada(id_persona: number, fechaISO: Date) {
    return this.model.create({
      id_persona,
      fecha: fechaISO,
      estado: 'ENTRADA',
    });
  }

  async marcarSalida(id_asistencia: number, hora: string) {
    const [, rows] = await this.model.update(
      { hora_salida: hora, estado: 'SALIDA' },
      { where: { id_asistencia }, returning: true },
    );
    console.log(rows);
    return rows && rows[0] ? rows[0] : null;
  }
}
