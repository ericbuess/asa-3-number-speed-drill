import { ArcadeButton } from '../ui/ArcadeButton';
import { PixelText } from '../ui/PixelText';
import { StarField } from '../ui/StarField';
import { PixelStar } from '../ui/icons';
import type { Stats } from '../types';

interface Props {
  onBack: () => void;
  stats: Stats;
}

export function StatsScreen({ onBack, stats }: Props) {
  const weekBars = stats.lastWeek;
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const max = Math.max(...weekBars, 1);
  const acc =
    stats.totalAttempts > 0 ? Math.round((stats.totalCorrect / stats.totalAttempts) * 100) : 0;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(180deg, #0a0a14 0%, #0a1a3e 100%)',
        position: 'relative',
        padding: 48,
        boxSizing: 'border-box',
        overflow: 'auto',
      }}
    >
      <StarField count={30} />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          marginBottom: 24,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <ArcadeButton onClick={onBack} color="#8a8aad" size="sm">
          ← BACK
        </ArcadeButton>
        <PixelText size={28} color="#4cf1ff" shadow="#b83dff">
          STAT VAULT
        </PixelText>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 14,
          position: 'relative',
          zIndex: 2,
          marginBottom: 28,
        }}
      >
        <StatTile icon="★" value={stats.totalStars} label="STARS EARNED" color="#ffd93d" />
        <StatTile icon="▶" value={stats.drillsCompleted} label="DRILLS DONE" color="#3ce67a" />
        <StatTile icon="✓" value={`${acc}%`} label="ACCURACY" color="#4cf1ff" />
        <StatTile icon="⚡" value={`${stats.bestPerMin}`} label="BEST / MIN" color="#ff2e63" />
      </div>

      <div
        style={{
          background: '#1a1a2e',
          border: '4px solid #ff7a1f',
          padding: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          position: 'relative',
          zIndex: 2,
          marginBottom: 28,
          boxShadow: '0 6px 0 #0a0a14',
        }}
      >
        <div
          style={{
            fontSize: 56,
            filter: 'drop-shadow(0 0 14px #ff7a1f)',
            fontFamily: "'Press Start 2P', monospace",
            color: '#ff7a1f',
          }}
        >
          ▲
        </div>
        <div style={{ flex: 1 }}>
          <PixelText size={12} color="#ff9ec7" shadow={null}>
            CURRENT STREAK
          </PixelText>
          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 44,
              color: '#ffd93d',
              textShadow: '3px 3px 0 #ff2e63',
              marginTop: 6,
            }}
          >
            {stats.streak} DAYS
          </div>
          <div
            style={{
              fontFamily: "'VT323', monospace",
              fontSize: 22,
              color: '#ff9ec7',
              marginTop: 4,
              letterSpacing: 1,
            }}
          >
            COME BACK TOMORROW TO KEEP THE FIRE ALIVE!
          </div>
        </div>
      </div>

      <div
        style={{
          background: '#1a1a2e',
          border: '4px solid #4cf1ff',
          padding: 20,
          position: 'relative',
          zIndex: 2,
          marginBottom: 24,
        }}
      >
        <PixelText size={12} color="#4cf1ff" shadow={null}>
          THIS WEEK · PROBLEMS / DAY
        </PixelText>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 10,
            height: 120,
            marginTop: 20,
          }}
        >
          {weekBars.map((v, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <div style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: '#fff' }}>
                {v}
              </div>
              <div
                style={{
                  width: '100%',
                  height: `${(v / max) * 100}%`,
                  background: i === weekBars.length - 1 ? '#ffd93d' : '#b83dff',
                  boxShadow: i === weekBars.length - 1 ? '0 0 12px #ffd93d' : 'none',
                  border: '2px solid #0a0a14',
                  minHeight: 4,
                }}
              />
              <div
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 10,
                  color: '#8a8aad',
                }}
              >
                {days[i]}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 2 }}>
        <PixelText size={12} color="#ff9ec7" shadow={null}>
          ◆ RECENT RUNS
        </PixelText>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
          {stats.recentRuns.length === 0 && (
            <div
              style={{
                fontFamily: "'VT323', monospace",
                fontSize: 20,
                color: '#8a8aad',
                padding: '12px 16px',
                border: '3px solid #2d2d5c',
                background: '#1a1a2e',
                letterSpacing: 1,
              }}
            >
              NO RUNS YET · GO BLAST SOME MATH
            </div>
          )}
          {stats.recentRuns.map((r, i) => (
            <div
              key={i}
              style={{
                background: '#1a1a2e',
                border: '3px solid #2d2d5c',
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  fontFamily: "'VT323', monospace",
                  fontSize: 20,
                  color: '#8a8aad',
                  width: 80,
                }}
              >
                {r.when}
              </div>
              <div
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 12,
                  color: '#fff',
                }}
              >
                {r.mode}
              </div>
              <div
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 14,
                  color: '#3ce67a',
                }}
              >
                {r.correct}/{r.total}
              </div>
              <div style={{ display: 'flex', gap: 3 }}>
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} style={{ opacity: j < r.stars ? 1 : 0.2 }}>
                    <PixelStar size={16} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatTile({
  icon,
  value,
  label,
  color,
}: {
  icon: string;
  value: string | number;
  label: string;
  color: string;
}) {
  return (
    <div
      style={{
        background: '#1a1a2e',
        border: `4px solid ${color}`,
        padding: '18px 14px',
        textAlign: 'center',
        boxShadow: '0 5px 0 #0a0a14',
      }}
    >
      <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 28, color }}>{icon}</div>
      <div
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 22,
          color: '#fff',
          marginTop: 8,
          textShadow: `2px 2px 0 ${color}`,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: "'VT323', monospace",
          fontSize: 16,
          color: '#8a8aad',
          marginTop: 6,
          letterSpacing: 1,
        }}
      >
        {label}
      </div>
    </div>
  );
}
