import 'dotenv/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Event Management API')
    .setDescription(
      'API for managing events, including creation, joining, and leaving events',
    )
    .setVersion('1.0')
    .addBearerAuth() // Add JWT authentication to Swagger
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: 'http://localhost:5173', // Дозволяємо запити з фронтенду
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Дозволяємо відправляти куки
  });

  await app.listen(process.env.PORT ?? 3000);
  app.useGlobalPipes(new ValidationPipe());
}
bootstrap();
