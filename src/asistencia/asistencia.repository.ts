import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { asistencia } from 'src/models/asistencia.model';

@Injectable()
export class AsistenciaRepository {
  constructor(@InjectModel(asistencia) private model: typeof asistencia) {}

  findLastOfDay(id_persona: number, fechaISO: string) {
    return this.model.findOne({
      where: { id_persona, fecha: fechaISO },
      order: [['id_asistencia', 'DESC']],
    });
  }

  createEntrada(id_persona: number, fechaISO: string, hora: string) {
    return this.model.create({
      id_persona,
      fecha: fechaISO,
      hora_entrada: hora,
      estado: 'ENTRADA',
    } as any);
  }

  async marcarSalida(row: asistencia, hora: string) {
    row.hora_salida = hora;
    row.estado = 'SALIDA';
    return row.save();
  }
}
