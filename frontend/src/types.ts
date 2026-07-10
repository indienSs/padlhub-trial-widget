export interface TrialCard {
  id: string;
  title: string;
  /** Бейдж типа тренировки в карточке-посте. */
  type: string;
  stationId: string;
  stationLabel: string;
  court?: string;
  /** Дата в формате YYYY-MM-DD. */
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

export interface TrialFilters {
  date?: string;
  stationId?: string;
  type?: string;
  level?: string;
}
