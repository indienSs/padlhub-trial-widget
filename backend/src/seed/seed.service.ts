import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TrialTraining, TrialTrainingDocument } from '../trials/schemas/trial-training.schema';
import {
  BOOKING_DAYS,
  DESCRIPTIONS,
  DIRECTIONS,
  IMPORTANT_NOTE,
  LEVELS,
  STATIONS,
  TRAINERS,
  TYPES,
  WHAT_TO_BRING,
} from './stations';

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickMany<T>(arr: readonly T[], min: number, max: number): T[] {
  const count = min + Math.floor(Math.random() * (max - min + 1));
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < count && copy.length; i++) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return out;
}

function addMinutes(hhmm: string, minutes: number): string {
  const [h, m] = hhmm.split(':').map(Number);
  const total = h * 60 + m + minutes;
  const hh = Math.floor((total / 60) % 24);
  const mm = total % 60;
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

function dateISO(offsetDays: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Слоты времени в течение дня. */
const TIME_SLOTS = ['10:00', '12:00', '14:00', '16:00', '18:00', '19:30', '21:00'];

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(TrialTraining.name) private readonly model: Model<TrialTrainingDocument>,
  ) {}

  async run(): Promise<number> {
    await this.model.deleteMany({}).exec();

    const docs: Partial<TrialTraining>[] = [];

    for (let dayOffset = 0; dayOffset < BOOKING_DAYS; dayOffset++) {
      const date = dateISO(dayOffset);
      const dow = new Date(date + 'T00:00:00').getDay();
      // В воскресенье тренировок меньше.
      const sessions = dow === 0 ? 3 : 4 + Math.floor(Math.random() * 2);

      const usedSlots = new Set<string>();
      for (let i = 0; i < sessions; i++) {
        let slot = pick(TIME_SLOTS);
        let guard = 0;
        while (usedSlots.has(slot) && guard < 10) {
          slot = pick(TIME_SLOTS);
          guard++;
        }
        usedSlots.add(slot);

        const station = pick(STATIONS);
        const trainer = pick(TRAINERS);
        const type = pick(TYPES);
        const level = pick(LEVELS);
        const direction = pick(DIRECTIONS);
        const duration = pick([60, 90]);
        const maxParticipants = type === 'Групповая тренировка' ? pick([6, 8]) : pick([4, 4, 8]);

        // Реалистичная занятость: чем раньше день — тем заполненее.
        const fillFactor = Math.max(0.1, 0.85 - dayOffset * 0.05);
        const participants = Math.min(
          maxParticipants,
          Math.round(maxParticipants * fillFactor * (0.5 + Math.random() * 0.5)),
        );
        const spotsLeft = Math.max(0, maxParticipants - participants);
        const waitlistCount = spotsLeft === 0 ? Math.floor(Math.random() * 3) : 0;

        docs.push({
          title: 'Первая пробная тренировка',
          type,
          stationId: station.id,
          stationLabel: station.label,
          court: `Корт ${1 + Math.floor(Math.random() * 4)}`,
          date,
          startTime: slot,
          endTime: addMinutes(slot, duration),
          trainerName: trainer.name,
          profileHandle: trainer.profileHandle,
          trainerAvatarUrl: trainer.avatarUrl,
          level,
          genderLabel: 'М/Ж',
          priceLabel: 'Бесплатно',
          directions: pickMany(DIRECTIONS, 1, 2),
          description: DESCRIPTIONS[type],
          whatToBring: [...WHAT_TO_BRING],
          importantNote: IMPORTANT_NOTE,
          maxParticipants,
          participants,
          spotsLeft,
          waitlistCount,
        });
      }
    }

    const result = await this.model.insertMany(docs, { ordered: true });
    this.logger.log(`Inserted ${result.length} trial trainings`);
    return result.length;
  }
}
