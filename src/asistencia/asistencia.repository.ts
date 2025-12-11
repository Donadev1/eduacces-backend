import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Asistencia } from 'src/models/asistencia.model';
import { Persona } from 'src/models/persona.model';

@Injectable()
export class AsistenciaRepository {
  constructor(@InjectModel(Asistencia) private model: typeof Asistencia) {}

  async findByPk(id_asistencia: number) {
    const data = await this.model.findByPk(id_asistencia, {
      attributes: {
        exclude: ['id_asistencia', 'id_persona'],
      },
      include: [
        {
          model: Persona,
          attributes: {
            exclude: ['id_persona', 'id_rol', 'correo', 'telefono'],
          },
        },
      ],
    });
    if (data) {
      const response = '{"ok": true, "data": '.concat(
        JSON.stringify(data).concat('}'),
      );
      return response;
    } else {
      const response = {
        ok: false,
        data: {},
      };
      return JSON.stringify(response);
    }
  }

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
    const [affected, rows] = await this.model.update(
      { hora_salida: hora, estado: 'SALIDA' },
      { where: { id_asistencia }, returning: true },
    );
    return rows && rows[0] ? rows[0] : null;
  }
}
