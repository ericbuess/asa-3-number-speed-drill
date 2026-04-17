import { useEffect, useRef, useState } from 'react';
import { recognizeNumber, type Point, type Stroke } from './recognize';

interface Props {
  width: number;
  height: number;
  onRecognize?: (n: number) => void;
  strokeColor?: string;
  disabled?: boolean;
  debugGuess?: boolean;
}

export function DrawCanvas({
  width,
  height,
  onRecognize,
  strokeColor = '#4cf1ff',
  disabled = false,
  debugGuess = false,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const currentRef = useRef<Stroke | null>(null);
  const guessTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [guess, setGuess] = useState<number | null>(null);

  const redraw = () => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = strokeColor;
    ctx.shadowColor = strokeColor;
    ctx.shadowBlur = 4;
    const all: Stroke[] = [...strokesRef.current];
    if (currentRef.current) all.push(currentRef.current);
    for (const stroke of all) {
      if (stroke.length < 2) continue;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i++) ctx.lineTo(stroke[i].x, stroke[i].y);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
  };

  const clear = () => {
    strokesRef.current = [];
    currentRef.current = null;
    setGuess(null);
    if (guessTimerRef.current) clearTimeout(guessTimerRef.current);
    redraw();
  };

  useEffect(() => {
    redraw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strokeColor]);

  const getPt = (e: React.MouseEvent | React.TouchEvent): Point => {
    const cvs = canvasRef.current!;
    const rect = cvs.getBoundingClientRect();
    const t = 'touches' in e ? e.touches[0] : (e as React.MouseEvent);
    return {
      x: (t.clientX - rect.left) * (cvs.width / rect.width),
      y: (t.clientY - rect.top) * (cvs.height / rect.height),
    };
  };

  const start = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    currentRef.current = [getPt(e)];
    if (guessTimerRef.current) clearTimeout(guessTimerRef.current);
  };

  const move = (e: React.MouseEvent | React.TouchEvent) => {
    if (!currentRef.current) return;
    e.preventDefault();
    currentRef.current.push(getPt(e));
    redraw();
  };

  const end = (e?: React.MouseEvent | React.TouchEvent) => {
    if (!currentRef.current) return;
    if (e) e.preventDefault();
    strokesRef.current.push(currentRef.current);
    currentRef.current = null;
    redraw();
    if (guessTimerRef.current) clearTimeout(guessTimerRef.current);
    guessTimerRef.current = setTimeout(() => {
      const n = recognizeNumber(strokesRef.current);
      setGuess(n);
      if (n !== null && onRecognize) onRecognize(n);
    }, 600);
  };

  return (
    <div style={{ position: 'relative', width, height }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
        style={{
          width,
          height,
          display: 'block',
          touchAction: 'none',
          cursor: disabled ? 'not-allowed' : 'crosshair',
        }}
      />
      <button
        onClick={clear}
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 8,
          background: '#2d2d5c',
          color: '#fff',
          border: '3px solid #0a0a14',
          padding: '6px 10px',
          cursor: 'pointer',
          letterSpacing: 1,
        }}
      >
        CLEAR
      </button>
      {debugGuess && guess !== null && (
        <div
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 8,
            background: '#ffd93d',
            color: '#0a0a14',
            padding: '4px 8px',
          }}
        >
          GUESS: {guess}
        </div>
      )}
    </div>
  );
}
