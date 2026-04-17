import type { CSSProperties, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  size?: number;
  color?: string;
  shadow?: string | null;
  style?: CSSProperties;
}

export function PixelText({
  children,
  size = 16,
  color = '#fff',
  shadow = '#0a0a14',
  style = {},
}: Props) {
  return (
    <span
      style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: size,
        color,
        textShadow: shadow ? `3px 3px 0 ${shadow}` : 'none',
        letterSpacing: 1,
        lineHeight: 1.3,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
