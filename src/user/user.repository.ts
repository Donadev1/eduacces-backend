import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Users } from 'src/models/users.model';
import { Persona } from 'src/models/persona.model';
import { Rol } from 'src/models/rol.model';
import { UpdateUserDto } from './dto/update.user.dto';
import { col } from 'sequelize';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(Users) private readonly model: typeof Users) {}

  findByCorreoWithPersonaRol(correo: string) {
    return this.model.findOne({
      where: { correo },
      include: [
        {
          model: Persona,
          as: 'persona',
          include: [
            { model: Rol, as: 'rol', attributes: ['id_rol', 'nombre'] },
          ],
        },
      ],
    });
  }

  create(data: {
    correo: string;
    password: string;
    id_persona: number;
    estado?: boolean;
  }) {
    return this.model.create(data);
  }

  //BUSCAR USERS
  async findById(id_user: number) {
    return this.model.findByPk(id_user, {
      attributes: { exclude: ['password'] },
    });
  }

  findAll(): Promise<Users[]> {
    return this.model.findAll({
      attributes: [
        'id_user',
        'correo',
        'id_persona',
        [col('persona.nombre'), 'persona'],
      ],
      include: [{ model: Persona, attributes: [] }],
      raw: true,
    });
  }

  async update(dto: UpdateUserDto, id_user: number) {
    await this.model.update(dto, { where: { id_user } });
  }

  async remove(id_user: number) {
    return this.model.destroy({ where: { id_user } });
  }
}
