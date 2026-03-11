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
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      throw new BadRequestException('Подія не знайдена');
    }
    // Перевіряємо, чи користувач вже приєднався
    const existingParticipant = await this.prisma.participant.findUnique({
      where: {
        userId_eventId: {
          eventId,
          userId,
        },
      },
    });
    if (existingParticipant) {
      throw new BadRequestException('Ви вже приєдналися до цієї події');
    }
    return this.prisma.participant.create({
      data: {
        eventId,
        userId,
      },
    });
  }

  async findAll() {
    return this.prisma.event.findMany({
      orderBy: { eventDate: 'asc' },
      include: { _count: { select: { participants: true } } }, // Покаже кількість учасників
    });
  }
}
