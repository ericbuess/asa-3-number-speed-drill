import { useEffect, useState, type ReactNode } from 'react';

const W = 1180;
const H = 820;
const INNER_W = 1060;
const INNER_H = 720;

const SPACE_WALLPAPER = 'radial-gradient(ellipse at center, #1a0a3e 0%, #06060c 100%)';

interface Props {
  children?: ReactNode;
  showFrame?: boolean;
}

export function IPadMiniFrame({ children, showFrame = true }: Props) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const availW = Math.min(window.innerWidth - 40, 1400);
      const availH = Math.min(window.innerHeight - 120, 1200);
      const s = Math.min(availW / W, availH / H, 1);
      setScale(s);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const pad = showFrame ? 22 : 0;
  const screenW = W - (showFrame ? 44 : 0);
  const screenH = H - (showFrame ? 44 : 0);
  const innerScale = Math.min(screenW / INNER_W, screenH / INNER_H, 1);

  return (
    <div style={{ width: W * scale, height: H * scale, position: 'relative' }}>
      <div
        style={{
          width: W,
          height: H,
          background: showFrame ? '#1a1a1d' : 'transparent',
          borderRadius: showFrame ? 46 : 0,
          padding: pad,
          position: 'absolute',
          transformOrigin: 'top left',
          transform: `scale(${scale})`,
          boxShadow: showFrame
            ? '0 0 0 4px #0a0a0c, 0 50px 100px rgba(0,0,0,0.6), inset 0 0 0 2px #2a2a2e'
            : 'none',
        }}
      >
        {showFrame && (
          <div
            style={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#0a0a0a',
              boxShadow: 'inset 0 0 0 1px #333',
            }}
          />
        )}
        <div
          style={{
            width: screenW,
            height: screenH,
            background: SPACE_WALLPAPER,
            borderRadius: showFrame ? 24 : 0,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: INNER_W,
                height: INNER_H,
                position: 'relative',
                overflow: 'hidden',
                transform: `scale(${innerScale})`,
                transformOrigin: 'center center',
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
