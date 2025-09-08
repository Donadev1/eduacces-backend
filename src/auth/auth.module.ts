// src/auth/auth.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler'; // 👈
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './middleware/jwt.middleware';
import { JwtAuthGuard } from './guard/auth/auth.guard';
import { UserModule } from 'src/user/user.module';
import { PersonaModule } from 'src/persona/persona.module';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    ThrottlerModule.forRoot([{ ttl: 60, limit: 5 }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION', '1h'),
        },
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => UserModule),
    forwardRef(() => PersonaModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
