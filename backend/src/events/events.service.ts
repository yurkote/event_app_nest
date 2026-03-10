import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(
    data: {
      title: string;
      description?: string;
      eventDate: string;
      location?: string;
    },
    creatorId: string,
  ) {
    console.log('Creator ID is:', creatorId);
    return this.prisma.event.create({
      data: {
        ...data,
        eventDate: new Date(data.eventDate),
        creator: { connect: { id: creatorId } },
      },
    });
  }

  async findAll() {
    return this.prisma.event.findMany({
      include: { _count: { select: { participants: true } } }, // Покаже кількість учасників
    });
  }
}
