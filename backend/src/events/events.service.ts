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

  async findAll() {
    return this.prisma.event.findMany({
      include: { _count: { select: { participants: true } } }, // Покаже кількість учасників
    });
  }
}
