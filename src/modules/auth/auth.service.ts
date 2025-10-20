import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && await this.usersService.comparePassword(pass, user.passwordHash)) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, name: user.name, email: user.email },
    };
  }

  async register(name: string, email: string, password: string) {
    const exists = await this.usersService.findByEmail(email);
    if (exists) throw new UnauthorizedException('Email already registered');
    const user = await this.usersService.create(name, email, password);
    return this.login(user);
  }
}
