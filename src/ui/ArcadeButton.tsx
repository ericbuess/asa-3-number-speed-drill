import { useState, type CSSProperties, type ReactNode } from 'react';

type Size = 'sm' | 'md' | 'lg' | 'xl';

interface Props {
  children?: ReactNode;
  onClick?: () => void;
  color?: string;
  textColor?: string;
  size?: Size;
  style?: CSSProperties;
  disabled?: boolean;
}

const SIZES: Record<Size, { fs: number; px: number; py: number }> = {
  sm: { fs: 10, px: 14, py: 10 },
  md: { fs: 14, px: 24, py: 16 },
  lg: { fs: 20, px: 40, py: 24 },
  xl: { fs: 28, px: 56, py: 32 },
};

export function ArcadeButton({
  children,
  onClick,
  color = '#ff2e63',
  textColor = '#fff',
  size = 'md',
  style = {},
  disabled = false,
}: Props) {
  const s = SIZES[size];
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      disabled={disabled}
      style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: s.fs,
        color: textColor,
        background: color,
        border: 'none',
        padding: `${s.py}px ${s.px}px`,
        cursor: disabled ? 'not-allowed' : 'pointer',
        position: 'relative',
        boxShadow: pressed
          ? 'inset 0 0 0 4px #0a0a14, 0 0 0 4px #0a0a14'
          : 'inset 0 0 0 4px #0a0a14, 0 0 0 4px #0a0a14, 0 6px 0 4px #0a0a14',
        transform: pressed ? 'translateY(6px)' : 'translateY(0)',
        transition: 'transform 60ms, box-shadow 60ms',
        letterSpacing: 1,
        opacity: disabled ? 0.5 : 1,
        textShadow: '2px 2px 0 rgba(0,0,0,0.3)',
        imageRendering: 'pixelated',
        ...style,
      }}
    >
      {children}
    </button>
  );
}
