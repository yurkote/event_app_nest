import { IsNotEmpty, IsString, IsDateString, MinDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description?: string;

  @IsDateString()
  @IsNotEmpty()
  // Примітка: MinDate працює з об'єктами Date, тому додаємо @Type
  @Type(() => Date) 
  // Ми перевіряємо, щоб дата була не раніше ніж "сьогодні"
  @MinDate(new Date())
  eventDate: string;

  @IsString()
  location?: string;
}
