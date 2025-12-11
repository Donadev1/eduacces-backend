import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import database from './database';
import { Persona } from 'src/models/persona.model';
import { Rol } from 'src/models/rol.model';
import { Users } from 'src/models/users.model';
import { HuellaMap } from 'src/models/hulla_map';
import { Asistencia } from 'src/models/asistencia.model';
import { DocenteMateriaFicha } from 'src/models/docente-materia-ficha.model';
import { EstudianteFicha } from 'src/models/estudiante-ficha.model';
import { Materias } from 'src/models/materias.model';
import { Carrera } from 'src/models/carrera.model';
import { Ficha } from 'src/models/ficha.model';

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
          models: [
            Persona,
            Rol,
            Users,
            HuellaMap,
            Asistencia,
            Ficha,
            Carrera,
            DocenteMateriaFicha,
            EstudianteFicha,
            Materias,
          ],
          synchronize: false,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
