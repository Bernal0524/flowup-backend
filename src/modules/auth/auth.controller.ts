import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsEmail, IsString } from 'class-validator';

class RegisterDto {
  @IsString() name: string;
  @IsEmail() email: string;
  @IsString() password: string;
}

class LoginDto {
  @IsEmail() email: string;
  @IsString() password: string;
}

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body.name, body.email, body.password);
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new Error('Invalid credentials'); // podés lanzar HttpException
    }
    return this.authService.login(user);
  }
}
