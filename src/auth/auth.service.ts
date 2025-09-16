import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/user/user.service';
import { PersonaService } from 'src/persona/persona.service';

type JwtPayload = {
  id_user: number;
  correo: string;
  id_persona: number;
  rol: 'instructor' | 'directora';
  nombre?: string;
  apellido?: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly personaService: PersonaService,
    private readonly jwt: JwtService,
  ) {}

  private sign(payload: JwtPayload) {
    return this.jwt.sign(payload, {
      secret: process.env.JWT_SECRET!,
      expiresIn: process.env.JWT_EXPIRES || '1d',
    });
  }

  private normalizeRole(input?: string): 'instructor' | 'directora' | null {
    if (!input) return null;
    const r = input
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .trim()
      .toLowerCase();

    const map: Record<string, 'instructor' | 'directora'> = {
      instructor: 'instructor',
      directora: 'directora',
      director: 'directora',
      directivo: 'directora',
      directiva: 'directora',
    };
    return map[r] ?? null;
  }

  async login(correo: string, password: string) {
    const correoNorm = correo.trim().toLowerCase();

    const user = await this.usersService.findByCorreoWithPersonaRol(correoNorm);
    if (!user || !user.estado)
      throw new UnauthorizedException('Credenciales inválidas');

    const hash = (user as any).password ?? (user as any).contrasena;
    if (!hash) throw new NotFoundException('Usuario sin contraseña registrada');

    const ok = await this.usersService.validatePassword(password, hash);
    if (!ok) throw new UnauthorizedException('Credenciales inválidas');

    const rolNormalizado = this.normalizeRole(user.persona?.rol?.nombre);
    if (!rolNormalizado) {
      throw new ForbiddenException(
        `Rol no autorizado para iniciar sesión: "${user.persona?.rol?.nombre ?? 'N/A'}"`,
      );
    }

    const payload: JwtPayload = {
      id_user: user.id_user,
      correo: user.correo,
      id_persona: user.id_persona,
      rol: rolNormalizado,
      nombre: user.persona?.nombre?.trim(),
      apellido: user.persona?.apellido?.trim(),
    };

    return { token: this.sign(payload), user: payload };
  }

  async me(userFromReq: JwtPayload) {
    return userFromReq;
  }
}
