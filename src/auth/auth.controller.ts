import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guard/auth/auth.guard';
import { Roles } from './decorators/roles/roles.decorator';
import { RolesGuard } from './guard/roles/roles.guard';
import { RegisterTestDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60 } })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.auth.login(dto.correo, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    return this.auth.me(req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('instructor', 'directivo')
  @Get('panel')
  panel() {
    return { ok: true, scope: 'panel de instructores y dirección' };
  }
  @Post('register-test')
  registerTest(@Body() dto: RegisterTestDto) {
    return this.auth.registerTest(dto);
  }
}
