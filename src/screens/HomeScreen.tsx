import { useEffect, useState } from 'react';
import { ArcadeButton } from '../ui/ArcadeButton';
import { PixelText } from '../ui/PixelText';
import { StarField } from '../ui/StarField';
import { PixelStar } from '../ui/icons';

interface Props {
  onStart: () => void;
  onSettings: () => void;
  onStats: () => void;
  onCollection: () => void;
  playerName: string;
  totalStars: number;
  totalStickers: number;
}

export function HomeScreen({
  onStart,
  onSettings,
  onStats,
  onCollection,
  playerName,
  totalStars,
  totalStickers,
}: Props) {
  const [titleBounce, setTitleBounce] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setTitleBounce((t) => t + 1), 800);
    return () => clearInterval(i);
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(180deg, #0a0a14 0%, #1a0a3e 60%, #3d1a6e 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 60px',
        boxSizing: 'border-box',
      }}
    >
      <StarField count={60} />

      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div
          style={{
            background: '#1a1a2e',
            padding: '10px 16px',
            border: '4px solid #4cf1ff',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              background: '#ffd93d',
              border: '3px solid #0a0a14',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 16,
              color: '#0a0a14',
            }}
          >
            {playerName[0] ?? 'A'}
          </div>
          <PixelText size={12} color="#4cf1ff" shadow={null}>
            PLAYER 1
          </PixelText>
          <PixelText size={14} color="#fff" shadow={null}>
            {playerName}
          </PixelText>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div
            style={{
              background: '#1a1a2e',
              padding: '10px 16px',
              border: '4px solid #ffd93d',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <PixelStar size={20} />
            <PixelText size={14} color="#ffd93d" shadow={null}>
              {totalStars}
            </PixelText>
          </div>
          <button
            onClick={onSettings}
            style={{
              background: '#1a1a2e',
              border: '4px solid #8a8aad',
              padding: 10,
              cursor: 'pointer',
              width: 52,
              height: 52,
            }}
          >
            <PixelText size={14} color="#fff" shadow={null}>
              ☰
            </PixelText>
          </button>
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          marginTop: 20,
          textAlign: 'center',
          transform: `translateY(${titleBounce % 2 === 0 ? 0 : -4}px)`,
          transition: 'transform 400ms',
        }}
      >
        <div
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 56,
            color: '#ffd93d',
            textShadow: '4px 4px 0 #ff2e63, 8px 8px 0 #b83dff, 12px 12px 0 #0a0a14',
            letterSpacing: 2,
            lineHeight: 1.1,
          }}
        >
          MATH
          <br />
          BLASTER
        </div>
        <div
          style={{
            fontFamily: "'VT323', monospace",
            fontSize: 32,
            color: '#4cf1ff',
            marginTop: 16,
            letterSpacing: 3,
          }}
        >
          ★ GALACTIC SPEED DRILL ★
        </div>
      </div>

      <div style={{ marginTop: 40, position: 'relative', zIndex: 2 }}>
        <ArcadeButton onClick={onStart} color="#ff2e63" size="xl">
          ▶ PLAY!
        </ArcadeButton>
        <div
          style={{
            fontFamily: "'VT323', monospace",
            fontSize: 24,
            color: '#ffd93d',
            textAlign: 'center',
            marginTop: 12,
            animation: 'blink 1s infinite',
          }}
        >
          PRESS TO START
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 20,
          marginTop: 'auto',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <button
          onClick={onCollection}
          style={{
            background: 'linear-gradient(135deg,#b83dff,#ff2e63)',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            boxShadow: 'inset 0 0 0 4px #0a0a14, 0 6px 0 4px #0a0a14',
            width: 200,
          }}
        >
          <div style={{ padding: '14px 16px' }}>
            <PixelText size={10} color="#fff" shadow="#0a0a14">
              STICKER BOOK
            </PixelText>
            <div
              style={{
                fontFamily: "'VT323', monospace",
                fontSize: 28,
                color: '#ffd93d',
                marginTop: 4,
              }}
            >
              {totalStickers} / 9
            </div>
          </div>
        </button>
        <button
          onClick={onStats}
          style={{
            background: 'linear-gradient(135deg,#4cf1ff,#3da5ff)',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            boxShadow: 'inset 0 0 0 4px #0a0a14, 0 6px 0 4px #0a0a14',
            width: 200,
          }}
        >
          <div style={{ padding: '14px 16px' }}>
            <PixelText size={10} color="#0a0a14" shadow={null}>
              HIGH SCORES
            </PixelText>
            <div
              style={{
                fontFamily: "'VT323', monospace",
                fontSize: 28,
                color: '#0a0a14',
                marginTop: 4,
              }}
            >
              STATS
            </div>
          </div>
        </button>
      </div>

      <div
        style={{
          marginTop: 24,
          fontFamily: "'VT323', monospace",
          fontSize: 18,
          color: 'rgba(255,255,255,0.5)',
          letterSpacing: 2,
          position: 'relative',
          zIndex: 2,
        }}
      >
        © 2026 STARQUEST ARCADE · v1.0
      </div>
    </div>
  );
}
