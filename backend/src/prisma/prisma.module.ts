import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Це зробить сервіс доступним у всьому додатку без повторного імпорту модуля
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}