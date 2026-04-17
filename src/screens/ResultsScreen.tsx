import { useEffect, useState } from 'react';
import { ArcadeButton } from '../ui/ArcadeButton';
import { PixelText } from '../ui/PixelText';
import { StarField } from '../ui/StarField';
import { PixelStar } from '../ui/icons';
import { starsFromCorrect, accuracy, perMin } from '../game/scoring';
import type { DrillResult } from '../types';

interface Props {
  result: DrillResult;
  onPlayAgain: () => void;
  onHome: () => void;
  onClaim: () => void;
  hasReward: boolean;
}

export function ResultsScreen({ result, onPlayAgain, onHome, onClaim, hasReward }: Props) {
  const { correct, wrong, elapsedSec } = result;
  const total = correct + wrong;
  const acc = accuracy(correct, total);
  const rate = perMin(correct, elapsedSec);
  const stars = starsFromCorrect(correct);
  const [shownStars, setShownStars] = useState(0);

  useEffect(() => {
    if (shownStars < stars) {
      const t = setTimeout(() => setShownStars((s) => s + 1), 500 + shownStars * 300);
      return () => clearTimeout(t);
    }
  }, [shownStars, stars]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(180deg, #0a0a14 0%, #3d1a6e 100%)',
        position: 'relative',
        padding: 40,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <StarField count={50} />

      <div
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 42,
          color: '#ffd93d',
          textShadow: '4px 4px 0 #ff2e63, 8px 8px 0 #0a0a14',
          marginTop: 10,
          position: 'relative',
          zIndex: 2,
          letterSpacing: 3,
        }}
      >
        STAGE CLEAR!
      </div>

      <div style={{ display: 'flex', gap: 24, marginTop: 30, position: 'relative', zIndex: 2 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              transform: i < shownStars ? 'scale(1)' : 'scale(0.4)',
              opacity: i < shownStars ? 1 : 0.2,
              transition:
                'transform 0.3s cubic-bezier(.4,2.4,.6,.9), opacity 0.3s',
              filter: i < shownStars ? 'drop-shadow(0 0 20px #ffd93d)' : 'none',
            }}
          >
            <PixelStar size={80} color={i < shownStars ? '#ffd93d' : '#2d2d5c'} />
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 36,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          width: '100%',
          maxWidth: 900,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <ResultStat label="CORRECT" value={correct} color="#3ce67a" />
        <ResultStat label="MISSED" value={wrong} color="#ff2e63" />
        <ResultStat label="ACCURACY" value={`${acc}%`} color="#4cf1ff" />
        <ResultStat label="PER MIN" value={rate} color="#ffd93d" />
      </div>

      {hasReward && (
        <div
          style={{
            marginTop: 32,
            position: 'relative',
            zIndex: 2,
            background: 'linear-gradient(135deg,#b83dff,#ff2e63)',
            border: '6px solid #ffd93d',
            padding: '18px 36px',
            boxShadow: '0 0 30px rgba(255,217,61,0.5), 0 8px 0 6px #0a0a14',
            textAlign: 'center',
          }}
        >
          <PixelText size={12} color="#fff" shadow="#0a0a14">
            ◆ NEW STICKER UNLOCKED! ◆
          </PixelText>
          <div
            style={{
              fontFamily: "'VT323', monospace",
              fontSize: 22,
              color: '#ffd93d',
              marginTop: 6,
              letterSpacing: 2,
            }}
          >
            TAP TO OPEN YOUR PACK!
          </div>
        </div>
      )}

      <div
        style={{
          marginTop: 'auto',
          display: 'flex',
          gap: 20,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <ArcadeButton onClick={onHome} color="#8a8aad" size="md">
          HOME
        </ArcadeButton>
        {hasReward && (
          <ArcadeButton onClick={onClaim} color="#ffd93d" textColor="#0a0a14" size="lg">
            ★ OPEN PACK ★
          </ArcadeButton>
        )}
        <ArcadeButton onClick={onPlayAgain} color="#3ce67a" textColor="#0a0a14" size="md">
          PLAY AGAIN
        </ArcadeButton>
      </div>
    </div>
  );
}

function ResultStat({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div
      style={{
        background: '#1a1a2e',
        border: `4px solid ${color}`,
        padding: '18px 12px',
        textAlign: 'center',
        boxShadow: '0 5px 0 #0a0a14',
      }}
    >
      <div
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 26,
          color: '#fff',
          textShadow: `2px 2px 0 ${color}`,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: "'VT323', monospace",
          fontSize: 18,
          color,
          marginTop: 8,
          letterSpacing: 1,
        }}
      >
        {label}
      </div>
    </div>
  );
}
