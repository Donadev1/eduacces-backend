import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly user_Repository: UserRepository) {}

  async getUserByEmail(email: string) {
    return this.user_Repository.findByCorreo(email);
  }
  async getUserById(id_user: number) {
    return this.user_Repository.findById(id_user);
  }
}
