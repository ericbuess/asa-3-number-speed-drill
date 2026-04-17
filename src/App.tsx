import { useEffect, useState } from 'react';
import { IPadMiniFrame } from './frame/IPadMiniFrame';
import { ScanlineOverlay } from './ui/ScanlineOverlay';
import { HomeScreen } from './screens/HomeScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { StatsScreen } from './screens/StatsScreen';
import { CollectionScreen } from './screens/CollectionScreen';
import { DrillScreen } from './screens/DrillScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { UnboxScreen } from './screens/UnboxScreen';
import { STICKERS } from './stickers/data';
import {
  loadSettings,
  saveSettings,
  loadOwned,
  saveOwned,
  loadStats,
  saveStats,
  loadPlayerName,
  calendarDayDiff,
} from './state/storage';
import { starsFromCorrect, perMin } from './game/scoring';
import type { DrillResult, Screen, Settings, Sticker, Stats, RecentRun } from './types';

function formatRecentLabel(at: number, now: number): string {
  const days = Math.floor((startOfDay(now) - startOfDay(at)) / 86_400_000);
  if (days <= 0) return 'TODAY';
  if (days === 1) return 'YDAY';
  return `${days}D AGO`;
}

function startOfDay(ms: number): number {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function dayOfWeekIndex(ms: number): number {
  // Monday = 0 ... Sunday = 6, matching the M T W T F S S design header.
  const dow = new Date(ms).getDay(); // Sun=0..Sat=6
  return (dow + 6) % 7;
}

function bumpWeek(week: number[], at: number, delta: number): number[] {
  const out = [...week];
  const idx = dayOfWeekIndex(at);
  out[idx] = (out[idx] ?? 0) + delta;
  return out;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [settings, setSettings] = useState<Settings>(() => loadSettings());
  const [owned, setOwned] = useState<string[]>(() => loadOwned());
  const [stats, setStats] = useState<Stats>(() => loadStats());
  const [playerName] = useState<string>(() => loadPlayerName());
  const [lastResult, setLastResult] = useState<DrillResult | null>(null);
  const [pendingReward, setPendingReward] = useState<Sticker | null>(null);

  // persist on change
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);
  useEffect(() => {
    saveOwned(owned);
  }, [owned]);
  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  const startDrill = () => setScreen('drill');
  const exitDrill = () => setScreen('home');

  const handleFinish = (result: DrillResult) => {
    setLastResult(result);

    const now = Date.now();
    const nowISO = new Date(now).toISOString();
    const gained = starsFromCorrect(result.correct);
    const rate = perMin(result.correct, result.elapsedSec);
    const total = result.correct + result.wrong;

    // streak: same-day = keep, next-day = +1, otherwise reset to 1
    const daysSince = calendarDayDiff(stats.lastDrillISO, nowISO);
    let nextStreak = stats.streak;
    if (!Number.isFinite(daysSince)) nextStreak = 1;
    else if (daysSince === 0) nextStreak = Math.max(stats.streak, 1);
    else if (daysSince === 1) nextStreak = stats.streak + 1;
    else nextStreak = 1;

    const recent: RecentRun = {
      when: formatRecentLabel(now, now),
      mode: settings.session,
      correct: result.correct,
      total,
      stars: gained,
      at: now,
    };
    const nextRecent = [recent, ...stats.recentRuns].slice(0, 8).map((r) => ({
      ...r,
      when: formatRecentLabel(r.at, now),
    }));

    setStats({
      totalStars: stats.totalStars + gained,
      drillsCompleted: stats.drillsCompleted + 1,
      totalCorrect: stats.totalCorrect + result.correct,
      totalAttempts: stats.totalAttempts + total,
      bestPerMin: Math.max(stats.bestPerMin, rate),
      streak: nextStreak,
      lastDrillISO: nowISO,
      lastWeek: bumpWeek(stats.lastWeek, now, result.correct),
      recentRuns: nextRecent,
    });

    const locked = STICKERS.filter((s) => !owned.includes(s.id));
    const reward =
      locked.length && result.correct > 0
        ? locked[Math.floor(Math.random() * locked.length)]
        : null;
    setPendingReward(reward);
    setScreen('results');
  };

  const openPack = () => setScreen('unbox');
  const claimReward = () => {
    if (pendingReward && !owned.includes(pendingReward.id)) {
      setOwned((o) => [...o, pendingReward.id]);
    }
    setPendingReward(null);
    setScreen('collection');
  };

  let content;
  switch (screen) {
    case 'home':
      content = (
        <HomeScreen
          onStart={startDrill}
          onSettings={() => setScreen('settings')}
          onStats={() => setScreen('stats')}
          onCollection={() => setScreen('collection')}
          playerName={playerName}
          totalStars={stats.totalStars}
          totalStickers={owned.length}
        />
      );
      break;
    case 'settings':
      content = (
        <SettingsScreen
          onBack={() => setScreen('home')}
          settings={settings}
          setSettings={(update) => setSettings((s) => update(s))}
        />
      );
      break;
    case 'stats':
      content = <StatsScreen onBack={() => setScreen('home')} stats={stats} />;
      break;
    case 'collection':
      content = <CollectionScreen onBack={() => setScreen('home')} owned={owned} />;
      break;
    case 'drill':
      content = (
        <DrillScreen settings={settings} onFinish={handleFinish} onExit={exitDrill} />
      );
      break;
    case 'results':
      content = lastResult ? (
        <ResultsScreen
          result={lastResult}
          onPlayAgain={() => setScreen('drill')}
          onHome={() => setScreen('home')}
          onClaim={openPack}
          hasReward={pendingReward !== null}
        />
      ) : (
        <div />
      );
      break;
    case 'unbox':
      content = pendingReward ? (
        <UnboxScreen sticker={pendingReward} onDone={claimReward} />
      ) : (
        <div />
      );
      break;
  }

  return (
    <IPadMiniFrame>
      {content}
      <ScanlineOverlay />
    </IPadMiniFrame>
  );
}
