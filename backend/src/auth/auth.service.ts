import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, pass: string, fullName: string) {
    // 1. Перевіряємо, чи існує користувач з таким email
    console.log('Реєстрація користувача:', email, fullName);
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email вже використовується');
    }

    // 2. Хешуємо пароль
    const passwordHash = await bcrypt.hash(pass, 10);
    // 3. Створюємо нового користувача
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
      },
    });
    // 4. Генеруємо JWT токен
    const payload = { email: user.email, id: user.id };
    const token = this.jwtService.sign(payload);
    return { user, token };
  }
}
