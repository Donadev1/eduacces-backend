// user.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { users } from 'src/models/users.model';
import { persona } from 'src/models/persona.model';
import { rol } from 'src/models/rol.model';
import { UsersRepository } from './user.repository';
import { PersonaRepository } from '../persona/persona.repository';
import { UsersService } from './user.service';
import { PersonaModule } from 'src/persona/persona.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserController } from './user.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([users, persona, rol]),
    forwardRef(() => PersonaModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UsersService, UsersRepository, PersonaRepository],
  exports: [UsersService, UsersRepository, PersonaRepository],
})
export class UserModule {}
