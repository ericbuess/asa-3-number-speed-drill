import { useMemo } from 'react';

interface Props {
  count?: number;
}

export function StarField({ count = 40 }: Props) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() < 0.7 ? 2 : 4,
        delay: Math.random() * 3,
        color:
          Math.random() < 0.8
            ? '#fff'
            : (['#ffd93d', '#4cf1ff', '#ff9ec7'][Math.floor(Math.random() * 3)] as string),
      })),
    [count],
  );
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {stars.map((s, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: s.color,
            animation: `twinkle 2s ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
