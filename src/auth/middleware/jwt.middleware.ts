// src/auth/middleware/jwt.middleware.ts (o jwt.strategy.ts)
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

type JwtPayload = {
  sub: number;
  correo: string;
  id_persona: number;
  rol: string;
  nombre?: string;
  apellido?: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') || 'default_jwt_secret',
    });
  }

  async validate(payload: JwtPayload) {
    return {
      id_user: payload.sub,
      correo: payload.correo,
      id_persona: payload.id_persona,
      rol: payload.rol,
      nombre: payload.nombre,
      apellido: payload.apellido,
    };
  }
}
