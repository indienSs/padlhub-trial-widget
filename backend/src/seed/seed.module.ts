import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TrialTraining, TrialTrainingSchema } from '../trials/schemas/trial-training.schema';
import { SeedService } from './seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/padlhub_trials',
    ),
    MongooseModule.forFeature([
      { name: TrialTraining.name, schema: TrialTrainingSchema },
    ]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
