import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) throw new UnauthorizedException('Токен відсутній');

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'SUPER_SECRET_KEY', // Має збігатися з тим, що в AuthModule
      });
      request['user'] = payload; // Додаємо дані користувача в об'єкт запиту
    } catch {
      throw new UnauthorizedException('Невалідний токен');
    }
    return true;
  }
}
