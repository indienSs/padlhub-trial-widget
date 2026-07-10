import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const config = app.get(ConfigService);
  const port = Number(config.get<string>('PORT') || 3001);
  const corsOrigin = config.get<string>('CORS_ORIGIN') || 'http://localhost:5173';

  app.setGlobalPrefix('');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );
  app.enableCors({
    origin: corsOrigin.split(',').map((o) => o.trim()),
    methods: ['GET'],
  });

  await app.listen(port);
  Logger.log(`Trials API listening on http://localhost:${port}`, 'Bootstrap');
}

void bootstrap();
