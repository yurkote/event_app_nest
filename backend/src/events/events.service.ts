import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateEventDto, creatorId: string) {
    const eventDate = new Date(data.eventDate);
    const now = new Date();
    if (eventDate < now) {
      throw new BadRequestException('Дата події не може бути в минулому');
    }
    return this.prisma.event.create({
      data: {
        ...data,
        eventDate,
        creatorId,
      },
    });
  }
  async join(eventId: string, userId: string) {
    // Перевіряємо, чи існує подія
    await this.validateEventExists(eventId);

    // Перевіряємо, чи користувач вже приєднався
    const isJoined = await this.checkParticipation(eventId, userId);
    if (isJoined) {
      throw new BadRequestException('Ви вже приєдналися до цієї події');
    }
    return this.prisma.participant.create({
      data: {
        eventId,
        userId,
      },
    });
  }

  async leave(eventId: string, userId: string) {
    // Перевіряємо, чи існує подія
    await this.validateEventExists(eventId);

    // Перевіряємо, чи користувач приєднався
    const isJoined = await this.checkParticipation(eventId, userId);
    if (!isJoined) {
      throw new BadRequestException('Ви не приєдналися до цієї події');
    }
    return this.prisma.participant.delete({
      where: {
        userId_eventId: {
          eventId,
          userId,
        },
      },
    });
  }

  async findAll() {
    return this.prisma.event.findMany({
      orderBy: { eventDate: 'asc' },
      include: { _count: { select: { participants: true } } }, // Покаже кількість учасників
    });
  }

  // Допоміжні функції
  private async validateEventExists(id: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) {
      throw new BadRequestException('Подія не знайдена');
    }
    return event; // Повертаємо об'єкт, він може знадобитися далі
  }

  private async checkParticipation(
    eventId: string,
    userId: string,
  ): Promise<boolean> {
    const participant = await this.prisma.participant.findUnique({
      where: { userId_eventId: { eventId, userId } },
    });
    return !!participant; // true якщо учасник існує, інакше false
  }
}
