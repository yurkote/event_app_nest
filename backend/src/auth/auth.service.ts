import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Треба буде створити цей сервіс
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(email: string, pass: string, fullName: string) {
    // 1. Перевіряємо чи є такий email
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // 2. Хешуємо пароль (сіль = 10)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(pass, salt);

    // 3. Зберігаємо в базу
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
      },
    });

    // Повертаємо дані без пароля
    const { passwordHash: _, ...result } = user;
    return result;
  }
}