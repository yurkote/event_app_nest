import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [EventsService],
  controllers: [EventsController],
  imports: [JwtModule],
})
export class EventsModule {}
