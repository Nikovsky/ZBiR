// @file: server/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { PrismaExceptionFilter } from './filters/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enviroment configuration
  const config: ConfigService = app.get(ConfigService);
  const PORT = config.get<number>('PORT') || 5000;
  const CLIENT_URL = config.get<string>('CLIENT_URL') || 'http://localhost:3000';

  // Prisma Client
  app.enableShutdownHooks();
  app.useGlobalFilters(new PrismaExceptionFilter());

  // Middleware
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin: CLIENT_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  Logger.log(`Middlewares enabled: CORS:${CLIENT_URL}, Helmet, Cookie Parser`, 'Middleware');

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  Logger.log('Validation pipe enabled', 'Validation');

  await app.listen(PORT ?? 5000);
  Logger.debug(`Server is running on ${await app.getUrl()}`, 'Bootstrap');
}
bootstrap();
//EOF