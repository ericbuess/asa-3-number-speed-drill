import { useEffect, useState } from 'react';
import { ArcadeButton } from '../ui/ArcadeButton';
import { PixelText } from '../ui/PixelText';
import { StarField } from '../ui/StarField';
import { StickerCard } from '../stickers/StickerCard';
import { STICKERS } from '../stickers/data';
import { RARITY_COLOR } from '../palette';
import type { Sticker } from '../types';

interface Props {
  sticker: Sticker;
  onDone: () => void;
}

type Phase = 'spinning' | 'reveal';

export function UnboxScreen({ sticker, onDone }: Props) {
  const [phase, setPhase] = useState<Phase>('spinning');
  const [reelIdx, setReelIdx] = useState(0);

  useEffect(() => {
    if (phase !== 'spinning') return;
    let i = 0;
    let interval = 60;
    let acc = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      setReelIdx((x) => (x + 1) % STICKERS.length);
      i++;
      acc += interval;
      if (acc < 2400) {
        interval = 60 + i * 8;
        timer = setTimeout(tick, interval);
      } else {
        setPhase('reveal');
      }
    };
    timer = setTimeout(tick, 60);
    return () => clearTimeout(timer);
  }, [phase]);

  const shownSticker = phase === 'reveal' ? sticker : STICKERS[reelIdx];
  const rarityGlow = RARITY_COLOR[sticker.rarity];

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: `radial-gradient(ellipse at center, ${
          phase === 'reveal' ? rarityGlow + '40' : '#1a0a3e'
        } 0%, #0a0a14 70%)`,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        boxSizing: 'border-box',
        transition: 'background 0.6s',
      }}
    >
      <StarField count={50} />

      {phase === 'reveal' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `conic-gradient(from 0deg, transparent 0deg 20deg, ${rarityGlow}40 20deg 40deg, transparent 40deg 60deg, ${rarityGlow}40 60deg 80deg, transparent 80deg 100deg, ${rarityGlow}40 100deg 120deg, transparent 120deg 140deg, ${rarityGlow}40 140deg 160deg, transparent 160deg 180deg, ${rarityGlow}40 180deg 200deg, transparent 200deg 220deg, ${rarityGlow}40 220deg 240deg, transparent 240deg 260deg, ${rarityGlow}40 260deg 280deg, transparent 280deg 300deg, ${rarityGlow}40 300deg 320deg, transparent 320deg 340deg, ${rarityGlow}40 340deg 360deg)`,
            opacity: 0.4,
            animation: 'rotate 6s linear infinite',
          }}
        />
      )}

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <PixelText size={18} color={phase === 'reveal' ? '#ffd93d' : '#4cf1ff'} shadow="#ff2e63">
          {phase === 'reveal' ? '★ YOU GOT... ★' : '🎰 OPENING PACK... 🎰'}
        </PixelText>

        <div
          style={{
            marginTop: 32,
            background: '#0a0a14',
            border: `6px solid ${rarityGlow}`,
            padding: 24,
            boxShadow:
              phase === 'reveal'
                ? `0 0 60px ${rarityGlow}, 0 0 120px ${rarityGlow}80, 0 8px 0 6px #0a0a14`
                : `0 0 20px ${rarityGlow}, 0 8px 0 6px #0a0a14`,
            display: 'inline-block',
            transform: phase === 'reveal' ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.5s cubic-bezier(.3,1.8,.6,.9), box-shadow 0.5s',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              animation: phase === 'reveal' ? 'bounce 0.6s' : 'none',
            }}
          >
            <StickerCard sticker={shownSticker} size={10} />
          </div>
        </div>

        {phase === 'reveal' && (
          <div style={{ marginTop: 28 }}>
            <div
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 24,
                color: rarityGlow,
                textShadow: '3px 3px 0 #0a0a14',
                letterSpacing: 2,
              }}
            >
              {sticker.name}
            </div>
            <div
              style={{
                fontFamily: "'VT323', monospace",
                fontSize: 26,
                color: '#fff',
                marginTop: 10,
                letterSpacing: 3,
              }}
            >
              ★ {sticker.rarity.toUpperCase()} ★
            </div>
          </div>
        )}

        {phase === 'reveal' && (
          <div style={{ marginTop: 32 }}>
            <ArcadeButton onClick={onDone} color="#3ce67a" textColor="#0a0a14" size="lg">
              ADD TO BOOK!
            </ArcadeButton>
          </div>
        )}
      </div>
    </div>
  );
}
