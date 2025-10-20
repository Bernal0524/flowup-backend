import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'supersecret_change_me',
    });
  }

  async validate(payload: any) {
    // payload.sub contiene userId
    const user = await this.usersService.findById(payload.sub);
    // Puedes devolver el usuario (se adjunta como request.user)
    return user ? { id: user.id, email: user.email, name: user.name } : null;
  }
}
