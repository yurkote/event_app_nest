import {
  IsNotEmpty,
  IsString,
  IsDateString,
  MinDate,
  IsNumber,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EventType } from '@prisma/client';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Meetup for developers' })
  title: string;

  @IsString()
  @ApiProperty({ example: 'A great meetup for developers' })
  description?: string;

  @IsDateString()
  @IsNotEmpty()
  // Примітка: MinDate працює з об'єктами Date, тому додаємо @Type
  @Type(() => Date)
  // Ми перевіряємо, щоб дата була не раніше ніж "сьогодні"
  @MinDate(new Date())
  @ApiProperty({ example: '2023-10-10T10:00:00.000Z' })
  eventDate: string;

  @IsNumber()
  @ApiProperty({ example: 100 })
  capacity?: number;

  @IsString()
  @ApiProperty({ example: '123 Main St' })
  location?: string;

  @IsEnum(EventType)
  @IsOptional()
  @ApiProperty({
    enum: EventType,
    example: 'PUBLIC',
    description: 'Type of event: PUBLIC or PRIVATE',
  })
  type?: EventType;
}
