import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import database from './database';
import { persona } from 'src/models/persona.model';
import { rol } from 'src/models/rol.model';
import { users } from 'src/models/users.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [database],
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<SequelizeModuleOptions> => {
        return {
          dialect: 'postgres',
          host: configService.get<string>('database.host'),
          port: configService.get<number>('database.port'),
          username: configService.get<string>('database.username'),
          password: configService.get<string>('database.password'),
          database: configService.get<string>('database.database'),
          autoLoadModels: true,
          models: [persona, rol, users],
          synchronize: false,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
