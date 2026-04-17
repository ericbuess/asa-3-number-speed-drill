import type { CSSProperties, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  color?: string;
  borderColor?: string;
  style?: CSSProperties;
  padding?: number;
}

export function PixelPanel({
  children,
  color = '#1a1a2e',
  borderColor = '#4cf1ff',
  style = {},
  padding = 24,
}: Props) {
  return (
    <div
      style={{
        position: 'relative',
        background: color,
        padding,
        boxShadow: `
          0 0 0 4px ${borderColor},
          0 0 0 8px #0a0a14,
          8px 8px 0 8px rgba(0,0,0,0.4)
        `,
        ...style,
      }}
    >
      <div style={{ position: 'absolute', top: -8, left: -8, width: 8, height: 8, background: '#0a0a14' }} />
      <div style={{ position: 'absolute', top: -8, right: -8, width: 8, height: 8, background: '#0a0a14' }} />
      <div style={{ position: 'absolute', bottom: -8, left: -8, width: 8, height: 8, background: '#0a0a14' }} />
      <div style={{ position: 'absolute', bottom: -8, right: -8, width: 8, height: 8, background: '#0a0a14' }} />
      {children}
    </div>
  );
}
