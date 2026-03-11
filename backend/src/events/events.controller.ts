import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard) // Тільки для залогінених
  @Post()
  async create(@Body() createEventDto: any, @Request() req) {
    console.log('Створення події:', createEventDto, 'Користувач:', req.user.id);
    return this.eventsService.create(createEventDto, req.user.id);
  }

  @Get()
  async findAll() {
    return this.eventsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  async join(@Param('id') eventId: string, @Request() req) {
    return this.eventsService.join(eventId, req.user.id);
  }
}
