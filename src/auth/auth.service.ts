import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/user/user.service';
import { RegisterTestDto } from './dto/register.dto';
import { PersonaService } from 'src/persona/persona.service';
import * as bcrypt from 'bcrypt';

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

    //console.log('DBG user:', {
    //correo: u.correo,
    //id_persona: u.id_persona,
    //rol: u.persona?.rol?.nombre,
    //});

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

  async registerTest(dto: RegisterTestDto) {
    const correo = dto.correo.trim().toLowerCase();

    const exists = await this.usersService.findByCorreoWithPersonaRol(correo);
    if (exists) throw new ConflictException('El correo ya esta registrado');

    const per = await this.personaService.findByIdWithRol(dto.id_persona);
    if (!per) throw new NotFoundException('Persona no existe');

    const hash = await bcrypt.hash(dto.password, 10);

    const nuevo = await this.usersService.create({
      correo,
      password: hash,
      id_persona: dto.id_persona,
      estado: dto.estado ?? true,
    });

    return {
      id_user: nuevo.id_user,
      correo: nuevo.correo,
      id_persona: nuevo.id_persona,
      estado: nuevo.estado,
      persona: {
        id_persona: per.id_persona,
        nombre: per.nombre,
        apellido: per.apellido,
        rol: per.rol?.nombre,
      },
    };
  }
}
