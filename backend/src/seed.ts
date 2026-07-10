import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SeedModule } from './seed/seed.module';
import { SeedService } from './seed/seed.service';

async function run() {
  const logger = new Logger('Seed');
  const app = await NestFactory.createApplicationContext(SeedModule);

  try {
    const seed = app.get(SeedService);
    const count = await seed.run();
    logger.log(`✓ Seeded ${count} trial trainings`);
  } catch (err) {
    logger.error('Seed failed', (err as Error)?.stack || err);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

void run();
