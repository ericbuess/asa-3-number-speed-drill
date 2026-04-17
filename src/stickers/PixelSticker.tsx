import type { Sticker } from '../types';
import { P, type PaletteKey } from '../palette';

interface Props {
  sticker: Sticker;
  size?: number;
  glow?: boolean;
}

export function PixelSticker({ sticker, size = 6, glow = false }: Props) {
  const px = size;
  return (
    <div
      style={{
        width: 16 * px,
        height: 16 * px,
        position: 'relative',
        filter: glow ? 'drop-shadow(0 0 12px rgba(255,217,61,0.6))' : 'none',
      }}
    >
      {sticker.pixels.map((row, y) =>
        row.split('').map((ch, x) => {
          if (ch === '.') return null;
          const color = P[ch as PaletteKey] ?? '#f0f';
          return (
            <div
              key={`${x}-${y}`}
              style={{
                position: 'absolute',
                left: x * px,
                top: y * px,
                width: px,
                height: px,
                background: color,
              }}
            />
          );
        }),
      )}
    </div>
  );
}
