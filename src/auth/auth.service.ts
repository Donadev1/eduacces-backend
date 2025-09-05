import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly user_service: UserService) {}

  async validateUserById(id_user: number) {
    return this.user_service.getUserById(id_user);
  }
}
