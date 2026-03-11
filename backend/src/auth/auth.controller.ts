import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth') // Це значить, що всі запити почнуться з /auth
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() RegisterDto: RegisterDto) {
    const { email, pass, fullName } = RegisterDto;
    // Викликаємо сервіс, який ми написали раніше
    return this.authService.register(email, pass, fullName);
  }
  @Post('login')
  async login(@Body() LoginDto: LoginDto) {
    const { email, pass } = LoginDto;
    return this.authService.login(email, pass);
  }
}
