import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { users } from 'src/models/users.model';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(users)
    private userModel: typeof users,
  ) {}

  async findByCorreo(correo: string): Promise<users | null> {
    return this.userModel.findOne({ where: { correo } });
  }

  async findById(id_user: number): Promise<users | null> {
    return this.userModel.findByPk(id_user);
  }
}
