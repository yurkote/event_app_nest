import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateEventDto } from './dto/create-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard) // Тільки для залогінених
  @Post()
  async create(@Body() createEventDto: CreateEventDto, @Request() req) {
    return this.eventsService.create(createEventDto, req.user.id);
  }

  @Get()
  async findAll() {
    return this.eventsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async findMyEvents(@Request() req) {
    return this.eventsService.findUserEvents(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  async join(@Param('id') eventId: string, @Request() req) {
    return this.eventsService.join(eventId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/leave')
  async leave(@Param('id') eventId: string, @Request() req) {
    return this.eventsService.leave(eventId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/edit')
  async update(
    @Param('id') eventId: string,
    @Request() req,
    @Body() data: UpdateEventDto,
  ) {
    return this.eventsService.update(eventId, req.user.id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') eventId: string, @Request() req) {
    return this.eventsService.remove(eventId, req.user.id);
  }
}
