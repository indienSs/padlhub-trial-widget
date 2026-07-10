import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { TrialTraining, TrialTrainingDocument } from './schemas/trial-training.schema';
import { QueryTrialsDto } from './dto/query-trials.dto';
import { BOOKING_DAYS } from '../seed/stations';

export interface TrialCardDto {
  id: string;
  title: string;
  type: string;
  stationId: string;
  stationLabel: string;
  court?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  trainerName: string;
  trainerAvatarUrl?: string;
  profileHandle?: string;
  level: string;
  genderLabel: string;
  priceLabel: string;
  directions: string[];
  description?: string;
  whatToBring: string[];
  importantNote?: string;
  maxParticipants: number;
  participants: number;
  spotsLeft: number;
  waitlistCount: number;
}

function todayISO(offsetDays = 0): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

@Injectable()
export class TrialsService {
  constructor(
    @InjectModel(TrialTraining.name) private readonly model: Model<TrialTrainingDocument>,
  ) {}

  private toDto(doc: TrialTrainingDocument): TrialCardDto {
    const maxParticipants = Math.max(0, doc.maxParticipants ?? 0);
    const participants = Math.max(0, Math.min(maxParticipants, doc.participants ?? 0));
    const spotsLeft =
      typeof doc.spotsLeft === 'number'
        ? Math.max(0, doc.spotsLeft)
        : Math.max(0, maxParticipants - participants);
    return {
      id: String(doc._id),
      title: doc.title,
      type: doc.type,
      stationId: doc.stationId,
      stationLabel: doc.stationLabel,
      court: doc.court,
      date: doc.date,
      startTime: doc.startTime,
      endTime: doc.endTime,
      trainerName: doc.trainerName,
      trainerAvatarUrl: doc.trainerAvatarUrl,
      profileHandle: doc.profileHandle,
      level: doc.level,
      genderLabel: doc.genderLabel ?? 'М/Ж',
      priceLabel: doc.priceLabel ?? 'Бесплатно',
      directions: doc.directions ?? [],
      description: doc.description,
      whatToBring: doc.whatToBring ?? [],
      importantNote: doc.importantNote,
      maxParticipants,
      participants,
      spotsLeft,
      waitlistCount: Math.max(0, doc.waitlistCount ?? 0),
    };
  }

  async findAll(query: QueryTrialsDto): Promise<TrialCardDto[]> {
    const filter: FilterQuery<TrialTrainingDocument> = {};

    if (query.date) {
      filter.date = query.date;
    } else {
      // Окно записи по умолчанию: сегодня + BOOKING_DAYS.
      filter.date = { $gte: todayISO(0), $lte: todayISO(BOOKING_DAYS - 1) };
    }

    if (query.stationId) filter.stationId = query.stationId;
    if (query.type) filter.type = query.type;
    if (query.level) filter.level = query.level;

    const docs = await this.model
      .find(filter)
      .sort({ date: 1, startTime: 1, _id: 1 })
      .exec();

    return docs.map((d) => this.toDto(d));
  }

  async findOne(id: string): Promise<TrialCardDto> {
    const doc = await this.model.findById(id).exec();
    if (!doc) throw new NotFoundException('Тренировка не найдена');
    return this.toDto(doc);
  }
}
