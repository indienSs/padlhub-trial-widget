import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TrialTrainingDocument = HydratedDocument<TrialTraining>;

@Schema({ timestamps: true, collection: 'trial_trainings' })
export class TrialTraining {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  /** Бейдж типа тренировки в карточке-посте. */
  @Prop({ required: true, enum: ['Открытая игра', 'Групповая тренировка'] })
  type: string;

  @Prop({ required: true })
  stationId: string;

  @Prop({ required: true })
  stationLabel: string;

  @Prop()
  court?: string;

  /** Дата в формате YYYY-MM-DD. */
  @Prop({ required: true, index: true })
  date: string;

  @Prop()
  startTime?: string;

  @Prop()
  endTime?: string;

  @Prop({ required: true })
  trainerName: string;

  @Prop()
  trainerAvatarUrl?: string;

  @Prop()
  profileHandle?: string;

  @Prop({ required: true })
  level: string;

  @Prop({ default: 'М/Ж' })
  genderLabel: string;

  @Prop({ default: 'Бесплатно' })
  priceLabel: string;

  @Prop({ type: [String], default: [] })
  directions: string[];

  @Prop()
  description?: string;

  @Prop({ type: [String], default: [] })
  whatToBring: string[];

  @Prop()
  importantNote?: string;

  @Prop({ required: true })
  maxParticipants: number;

  @Prop({ required: true })
  participants: number;

  /** Вычисляется при чтении, если не задано явно. */
  @Prop()
  spotsLeft?: number;

  @Prop({ default: 0 })
  waitlistCount: number;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const TrialTrainingSchema = SchemaFactory.createForClass(TrialTraining);

TrialTrainingSchema.index({ date: 1, startTime: 1 });
