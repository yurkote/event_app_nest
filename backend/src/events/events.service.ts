import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { Prisma, Event } from '@prisma/client';
import { UpdateEventDto } from './dto/update-event.dto';

type EventWithCount = Prisma.EventGetPayload<{
  include: { _count: { select: { participants: true } } };
}>;

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
    const event = await this.validateEventExists(eventId);

    // Перевіряємо, чи користувач вже приєднався
    const isJoined = await this.checkParticipation(eventId, userId);
    if (isJoined) {
      throw new BadRequestException('Ви вже приєдналися до цієї події');
    }
    // Перевіряємо, чи не досягнуто максимальної кількості учасників
    if (event.capacity && event._count.participants >= event.capacity) {
      throw new BadRequestException(
        'Досягнуто максимальної кількості учасників',
      );
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

  async update(eventId: string, userId: string, data: UpdateEventDto) {
    const event = await this.validateEventExists(eventId);

    // Перевіряємо, чи користувач є творцем події
    this.validateEventAuthor(event.creatorId, userId);

    return this.prisma.event.update({
      where: { id: eventId },
      data: {
        ...data,
        capacity: data.capacity ? Number(data.capacity) : null, // Якщо capacity не вказано, залишаємо його без змін
        eventDate: data.eventDate ? new Date(data.eventDate) : event.eventDate, // Якщо eventDate не вказано, залишаємо його без змін
      },
    });
  }

  async remove(eventId: string, userId: string) {
    const event = await this.validateEventExists(eventId);

    // Перевіряємо, чи користувач є творцем події
    this.validateEventAuthor(event.creatorId, userId);

    return this.prisma.event.delete({ where: { id: eventId } });
  }

  async findAll() {
    return this.prisma.event.findMany({
      orderBy: { eventDate: 'asc' },
      include: {
        _count: { select: { participants: true } },
        participants: { select: { userId: true } },
      }, // Покаже кількість учасників
    });
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        creator: { select: { fullName: true, email: true } },
        participants: {
          include: { user: { select: { fullName: true } } },
        },
        _count: { select: { participants: true } },
      },
    });
    if (!event) {
      throw new NotFoundException(`Подію з ID ${id} не знайдено`);
    }

    return event;
  }

  async findUserEvents(userId: string) {
    return this.prisma.event.findMany({
      where: {
        OR: [
          { creatorId: userId }, // Події, які створив користувач
          { participants: { some: { userId } } }, // Події, до яких приєднався користувач
        ],
      },
      orderBy: { eventDate: 'asc' },
      include: { creator: true },
    });
  }

  // Допоміжні функції
  private async validateEventExists(eventId: string): Promise<EventWithCount> {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { participants: true } } },
    });
    if (!event) {
      throw new NotFoundException('Подію не знайдено');
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

  private validateEventAuthor(creatorId: string, userId: string): void {
    if (creatorId !== userId) {
      throw new ForbiddenException(
        'Ви не є автором цієї події, тому не можете її редагувати чи видаляти',
      );
    }
  }
}
