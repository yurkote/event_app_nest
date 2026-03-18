import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({connectionString: process.env.DATABASE_URL});
const adapter = new PrismaPg(pool);

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      adapter,
      log: ['query', 'error', 'warn'], // Логування запитів та помилок
    });
  }
  async onModuleInit() {
    await this.$connect();
  }
  async onModuleDestroy() {
    // Закриваємо з'єднання при зупинці додатка
    await this.$disconnect();
  }
}
