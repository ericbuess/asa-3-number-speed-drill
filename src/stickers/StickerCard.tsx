import type { Sticker } from '../types';
import { RARITY_COLOR } from '../palette';
import { PixelSticker } from './PixelSticker';

interface Props {
  sticker: Sticker;
  size?: number;
  owned?: boolean;
  locked?: boolean;
}

export function StickerCard({ sticker, size = 6, owned = true, locked = false }: Props) {
  const rarityColor = RARITY_COLOR[sticker.rarity];

  return (
    <div
      style={{
        background: owned ? sticker.bg : '#1a1a2e',
        border: `3px solid ${owned ? rarityColor : '#2d2d5c'}`,
        padding: 12,
        position: 'relative',
        imageRendering: 'pixelated',
        boxShadow: owned ? '0 0 0 2px #0a0a14, 0 4px 0 #0a0a14' : '0 4px 0 #0a0a14',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 16 * size,
          filter: !owned ? 'brightness(0.15) contrast(2)' : 'none',
        }}
      >
        {locked ? (
          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 36,
              color: '#2d2d5c',
            }}
          >
            ?
          </div>
        ) : (
          <PixelSticker sticker={sticker} size={size} />
        )}
      </div>
      <div
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 8,
          color: owned ? '#0a0a14' : '#2d2d5c',
          textAlign: 'center',
          marginTop: 8,
          textShadow: owned ? '1px 1px 0 rgba(255,255,255,0.4)' : 'none',
          letterSpacing: 0.5,
        }}
      >
        {owned ? sticker.name : '???'}
      </div>
      <div
        style={{
          position: 'absolute',
          top: -8,
          right: -8,
          background: rarityColor,
          color: '#0a0a14',
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 7,
          padding: '3px 5px',
          border: '2px solid #0a0a14',
          textTransform: 'uppercase',
          opacity: owned ? 1 : 0.3,
        }}
      >
        {sticker.rarity[0]}
      </div>
    </div>
  );
}
