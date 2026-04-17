import type { Settings, Stats } from '../types';
import { DEFAULT_SETTINGS, DEFAULT_STATS } from './defaults';

const PREFIX = 'starcadets:v1:';
const K_SETTINGS = PREFIX + 'settings';
const K_OWNED = PREFIX + 'owned';
const K_STATS = PREFIX + 'stats';
const K_PLAYER = PREFIX + 'player';

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed == null ? fallback : (parsed as T);
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota, private mode, etc. */
  }
}

export function loadSettings(): Settings {
  return { ...DEFAULT_SETTINGS, ...read<Partial<Settings>>(K_SETTINGS, {}) };
}
export function saveSettings(s: Settings) {
  write(K_SETTINGS, s);
}

export function loadOwned(): string[] {
  return read<string[]>(K_OWNED, []);
}
export function saveOwned(owned: string[]) {
  write(K_OWNED, owned);
}

export function loadStats(): Stats {
  return { ...DEFAULT_STATS, ...read<Partial<Stats>>(K_STATS, {}) };
}
export function saveStats(s: Stats) {
  write(K_STATS, s);
}

export function loadPlayerName(): string {
  return read<string>(K_PLAYER, 'ASTRO');
}
export function savePlayerName(name: string) {
  write(K_PLAYER, name);
}

/** Start-of-day in ms. */
export function startOfDay(d: Date): number {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}

/** How many calendar days between two ISO timestamps (ignoring time of day). */
export function calendarDayDiff(aISO: string | null, bISO: string): number {
  if (!aISO) return Infinity;
  const a = startOfDay(new Date(aISO));
  const b = startOfDay(new Date(bISO));
  return Math.round((b - a) / 86_400_000);
}
