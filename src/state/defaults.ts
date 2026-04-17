import type { Settings, Stats } from '../types';

export const DEFAULT_SETTINGS: Settings = {
  session: '60s',
  penColor: '#4cf1ff',
  sound: true,
  haptics: true,
};

export const DEFAULT_STATS: Stats = {
  totalStars: 0,
  drillsCompleted: 0,
  totalCorrect: 0,
  totalAttempts: 0,
  bestPerMin: 0,
  streak: 0,
  lastDrillISO: null,
  lastWeek: [0, 0, 0, 0, 0, 0, 0],
  recentRuns: [],
};
