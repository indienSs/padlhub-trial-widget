import type { TrialCard, TrialFilters } from '../types';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function parseError(res: Response): Promise<never> {
  let message = `Ошибка запроса (${res.status})`;
  try {
    const data = await res.json();
    if (data?.message) message = Array.isArray(data.message) ? data.message[0] : data.message;
  } catch {
    /* ignore */
  }
  throw new ApiError(message, res.status);
}

export async function fetchTrials(filters: TrialFilters = {}): Promise<TrialCard[]> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value != null && value !== '') params.set(key, String(value));
  });
  const qs = params.toString();
  const res = await fetch(`/api/trials${qs ? `?${qs}` : ''}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) return parseError(res);
  return (await res.json()) as TrialCard[];
}

export async function fetchTrialById(id: string): Promise<TrialCard> {
  const res = await fetch(`/api/trials/${encodeURIComponent(id)}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) return parseError(res);
  return (await res.json()) as TrialCard;
}
