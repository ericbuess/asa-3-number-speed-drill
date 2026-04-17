import { useState } from 'react';
import { ArcadeButton } from '../ui/ArcadeButton';
import { PixelText } from '../ui/PixelText';
import { StarField } from '../ui/StarField';
import { StickerCard } from '../stickers/StickerCard';
import { STICKERS } from '../stickers/data';
import type { Rarity, Sticker } from '../types';
import { RARITY_COLOR } from '../palette';

interface Props {
  onBack: () => void;
  owned: string[];
}

const RARITY_ORDER: Record<Rarity, number> = { common: 0, rare: 1, epic: 2, legendary: 3 };

export function CollectionScreen({ onBack, owned }: Props) {
  const sorted = [...STICKERS].sort((a, b) => RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity]);
  const [selected, setSelected] = useState<Sticker | null>(null);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(180deg, #1a0a3e 0%, #3d1a6e 100%)',
        position: 'relative',
        padding: 40,
        boxSizing: 'border-box',
        overflow: 'auto',
      }}
    >
      <StarField count={40} />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <ArcadeButton onClick={onBack} color="#8a8aad" size="sm">
            ← BACK
          </ArcadeButton>
          <div>
            <PixelText size={28} color="#ffd93d" shadow="#ff2e63">
              STICKER BOOK
            </PixelText>
            <div
              style={{
                fontFamily: "'VT323', monospace",
                fontSize: 22,
                color: '#ff9ec7',
                marginTop: 6,
                letterSpacing: 2,
              }}
            >
              ★ SPACE HEROES OF THE ASTRA QUADRANT ★
            </div>
          </div>
        </div>
        <div
          style={{
            background: '#1a1a2e',
            border: '4px solid #ffd93d',
            padding: '10px 16px',
          }}
        >
          <PixelText size={12} color="#ffd93d" shadow={null}>
            {owned.length} / {STICKERS.length}
          </PixelText>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 18,
          position: 'relative',
          zIndex: 2,
        }}
      >
        {sorted.map((s) => {
          const isOwned = owned.includes(s.id);
          return (
            <button
              key={s.id}
              onClick={() => isOwned && setSelected(s)}
              disabled={!isOwned}
              style={{ all: 'unset', cursor: isOwned ? 'pointer' : 'default' }}
            >
              <StickerCard sticker={s} size={7} owned={isOwned} locked={!isOwned} />
            </button>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 24,
          background: '#1a1a2e',
          border: '3px solid #2d2d5c',
          padding: 14,
          display: 'flex',
          justifyContent: 'space-around',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {(Object.keys(RARITY_ORDER) as Rarity[]).map((r) => (
          <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 14, height: 14, background: RARITY_COLOR[r] }} />
            <div
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 9,
                color: '#fff',
                textTransform: 'uppercase',
              }}
            >
              {r}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#1a1a2e',
              border: '6px solid #ffd93d',
              padding: 32,
              boxShadow: '0 0 40px rgba(255,217,61,0.5)',
              textAlign: 'center',
              maxWidth: 400,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <StickerCard sticker={selected} size={10} />
            </div>
            <PixelText size={16} color="#ffd93d" shadow="#ff2e63">
              {selected.name}
            </PixelText>
            <div
              style={{
                fontFamily: "'VT323', monospace",
                fontSize: 20,
                color: '#4cf1ff',
                marginTop: 12,
                letterSpacing: 1,
              }}
            >
              RARITY: {selected.rarity.toUpperCase()}
            </div>
            <div style={{ marginTop: 20 }}>
              <ArcadeButton
                onClick={() => setSelected(null)}
                color="#3ce67a"
                size="sm"
              >
                CLOSE
              </ArcadeButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
