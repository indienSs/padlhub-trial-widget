import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrialsController } from './trials.controller';
import { TrialsService } from './trials.service';
import { TrialTraining, TrialTrainingSchema } from './schemas/trial-training.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TrialTraining.name, schema: TrialTrainingSchema },
    ]),
  ],
  controllers: [TrialsController],
  providers: [TrialsService],
  exports: [TrialsService],
})
export class TrialsModule {}
