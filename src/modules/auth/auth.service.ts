import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  // Validar usuario en login
  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && await this.usersService.comparePassword(pass, user.passwordHash)) {
      return user;
    }
    return null;
  }

  // Login → devuelve token y datos de usuario
  async login(user: any) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, name: user.name, email: user.email },
    };
  }

  // Register → crea usuario y devuelve token
  async register(name: string, email: string, password: string) {
    const exists = await this.usersService.findByEmail(email);
    if (exists) throw new UnauthorizedException('Email already registered');
    const user = await this.usersService.create(name, email, password);
    return this.login(user);
  }

  // Forgot password → inicia proceso de recuperación
  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Opcional: no revelar que el email no existe
      throw new NotFoundException('Usuario no encontrado');
    }

    // Generar token temporal (JWT de 1 hora)
    const token = this.jwtService.sign({ sub: user.id }, { expiresIn: '1h' });

    // Aquí enviarías el token por correo
    // Simulamos envío
    console.log(`Token de recuperación para ${email}: ${token}`);

    return { message: 'Se ha enviado un correo de recuperación.' };
  }

  // Reset password → cambia contraseña usando token
  async resetPassword(token: string, newPassword: string) {
    try {
      const payload: any = this.jwtService.verify(token);
      const user = await this.usersService.findById(payload.sub);
      if (!user) throw new NotFoundException('Usuario no encontrado');

      const saltRounds = 10;
      user.passwordHash = await bcrypt.hash(newPassword, saltRounds);
      await this.usersService.save(user);

      return { message: 'Contraseña actualizada con éxito.' };
    } catch (err) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
