import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth') // Це значить, що всі запити почнуться з /auth
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: { email: string; pass: string; fullName: string },
  ) {
    // Викликаємо сервіс, який ми написали раніше
    return this.authService.register(body.email, body.pass, body.fullName);
  }
}
