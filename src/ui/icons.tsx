interface IconProps {
  size?: number;
  color?: string;
}

function PixelGrid({ rows, size, color }: { rows: string[]; size: number; color: string }) {
  const px = size / 8;
  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      {rows.map((row, y) =>
        row.split('').map((c, x) =>
          c === 'X' ? (
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
          ) : null,
        ),
      )}
    </div>
  );
}

const HEART = [
  '.XX..XX.',
  'XXXXXXXX',
  'XXXXXXXX',
  'XXXXXXXX',
  '.XXXXXX.',
  '..XXXX..',
  '...XX...',
  '........',
];

const STAR = [
  '...XX...',
  '...XX...',
  '.XXXXXX.',
  'XXXXXXXX',
  'XXXXXXXX',
  '.XXXXXX.',
  '.XX..XX.',
  'XX....XX',
];

const TROPHY = [
  'XXXXXXXX',
  'X.XXXX.X',
  'X.XXXX.X',
  'X.XXXX.X',
  '.XXXXXX.',
  '...XX...',
  '.XXXXXX.',
  'XXXXXXXX',
];

export function PixelHeart({ size = 16, color = '#ff2e63' }: IconProps) {
  return <PixelGrid rows={HEART} size={size} color={color} />;
}

export function PixelStar({ size = 16, color = '#ffd93d' }: IconProps) {
  return <PixelGrid rows={STAR} size={size} color={color} />;
}

export function PixelTrophy({ size = 24, color = '#ffd93d' }: IconProps) {
  return <PixelGrid rows={TROPHY} size={size} color={color} />;
}
