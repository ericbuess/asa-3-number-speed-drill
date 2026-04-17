import { useEffect, useRef, useState } from 'react';
import { DrawCanvas } from '../draw/DrawCanvas';
import { StarField } from '../ui/StarField';
import { genProblem } from '../game/problems';
import type { DrillResult, Problem, Settings } from '../types';

interface Props {
  settings: Settings;
  onFinish: (r: DrillResult) => void;
  onExit: () => void;
}

type UiState = 'drawing' | 'correct' | 'wrong';

export function DrillScreen({ settings, onFinish, onExit }: Props) {
  const totalTime = settings.session === '60s' ? 60 : settings.session === '30s' ? 30 : 999;
  const totalProblems = settings.session === '20p' ? 20 : 999;
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [problems, setProblems] = useState<Problem[]>(() => [genProblem()]);
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [state, setState] = useState<UiState>('drawing');
  const [combo, setCombo] = useState(0);
  const [lastGuess, setLastGuess] = useState<number | null>(null);
  const [shake, setShake] = useState(false);
  const [canvasKey, setCanvasKey] = useState(0);
  const finishedRef = useRef(false);

  const current = problems[idx];

  // countdown timer (skip for 20p mode)
  useEffect(() => {
    if (settings.session === '20p') return;
    if (finishedRef.current) return;
    if (timeLeft <= 0) {
      finishedRef.current = true;
      onFinish({ correct, wrong, elapsedSec: totalTime });
      return;
    }
    const t = setTimeout(() => setTimeLeft((x) => x - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  // 20-problem finish
  useEffect(() => {
    if (finishedRef.current) return;
    if (settings.session === '20p' && correct >= totalProblems) {
      finishedRef.current = true;
      onFinish({ correct, wrong, elapsedSec: totalTime - timeLeft });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [correct]);

  const nextProblem = () => {
    setProblems((p) => [...p, genProblem()]);
    setIdx((i) => i + 1);
    setState('drawing');
    setLastGuess(null);
    setCanvasKey((k) => k + 1);
  };

  const handleRecognize = (n: number) => {
    if (state !== 'drawing') return;
    setLastGuess(n);
    if (n === current.ans) {
      setState('correct');
      setCorrect((c) => c + 1);
      setCombo((c) => c + 1);
      setTimeout(nextProblem, 1100);
    } else {
      setState('wrong');
      setWrong((w) => w + 1);
      setCombo(0);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => {
        setState('drawing');
        setCanvasKey((k) => k + 1);
      }, 1400);
    }
  };

  const progress =
    settings.session === '20p'
      ? correct / totalProblems
      : (totalTime - timeLeft) / totalTime;

  const timerColor = timeLeft > 20 ? '#3ce67a' : timeLeft > 10 ? '#ffd93d' : '#ff2e63';

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(180deg,#0a0a14 0%, #1a0a3e 100%)',
        position: 'relative',
        padding: '28px 40px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        transform: shake ? 'translateX(6px)' : 'translateX(0)',
        animation: shake ? 'shake 0.4s' : 'none',
        overflow: 'hidden',
      }}
    >
      <StarField count={20} />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 16,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <button
          onClick={onExit}
          style={{
            background: '#1a1a2e',
            border: '3px solid #8a8aad',
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 10,
            color: '#fff',
            padding: '8px 12px',
            cursor: 'pointer',
            letterSpacing: 1,
          }}
        >
          × QUIT
        </button>

        <div
          style={{
            flex: 1,
            background: '#1a1a2e',
            border: `4px solid ${timerColor}`,
            padding: '6px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: `0 0 16px ${timerColor}`,
          }}
        >
          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 18,
              color: timerColor,
              width: 60,
              textAlign: 'center',
            }}
          >
            {settings.session === '20p' ? `${correct}/${totalProblems}` : `${timeLeft}s`}
          </div>
          <div
            style={{
              flex: 1,
              height: 16,
              background: '#0a0a14',
              border: '2px solid #2d2d5c',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${Math.min(100, progress * 100)}%`,
                background: `repeating-linear-gradient(90deg, ${timerColor} 0, ${timerColor} 6px, ${timerColor}aa 6px, ${timerColor}aa 12px)`,
                transition: 'width 0.9s linear',
                boxShadow: `0 0 8px ${timerColor}`,
              }}
            />
          </div>
        </div>

        <div
          style={{
            background: '#1a1a2e',
            border: '4px solid #3ce67a',
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 10,
              color: '#3ce67a',
            }}
          >
            OK
          </div>
          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 18,
              color: '#fff',
            }}
          >
            {correct}
          </div>
        </div>

        {combo >= 2 && (
          <div
            style={{
              background: '#ff7a1f',
              border: '4px solid #0a0a14',
              padding: '6px 12px',
              animation: 'pulse 0.6s infinite',
            }}
          >
            <div
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 14,
                color: '#fff',
                textShadow: '2px 2px 0 #0a0a14',
              }}
            >
              x{combo} COMBO!
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          background: '#1a1a2e',
          border: '6px solid #ffd93d',
          padding: '24px 40px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2,
          boxShadow:
            '0 0 0 6px #0a0a14, 0 8px 0 6px #0a0a14, 0 0 60px rgba(255,217,61,0.3)',
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 10,
            color: '#4cf1ff',
            letterSpacing: 2,
          }}
        >
          ◆ LEVEL 1 · PROBLEM {correct + wrong + 1} ◆
        </div>
        <div
          style={{
            marginTop: 16,
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 56,
            color: '#fff',
            textShadow: '4px 4px 0 #ff2e63, 8px 8px 0 #0a0a14',
            letterSpacing: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 18,
          }}
        >
          <span style={{ color: '#ffd93d' }}>{current.a}</span>
          <span style={{ color: '#4cf1ff' }}>{current.op1}</span>
          <span style={{ color: '#ffd93d' }}>{current.b}</span>
          <span style={{ color: '#4cf1ff' }}>{current.op2}</span>
          <span style={{ color: '#ffd93d' }}>{current.c}</span>
          <span style={{ color: '#ff9ec7' }}>=</span>
          <span style={{ color: '#3ce67a' }}>?</span>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            background: '#0a0a14',
            border: '5px solid #4cf1ff',
            boxShadow: '0 0 30px rgba(76,241,255,0.4), 0 6px 0 #0a0a14',
            position: 'relative',
            width: 760,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'linear-gradient(#1a2a4e 1px, transparent 1px), linear-gradient(90deg, #1a2a4e 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 40,
              right: 40,
              top: '75%',
              borderBottom: '2px dashed #4cf1ff60',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 10,
              left: 14,
              fontFamily: "'VT323', monospace",
              fontSize: 18,
              color: '#4cf1ff80',
              letterSpacing: 1,
            }}
          >
            ✎ DRAW YOUR ANSWER HERE
          </div>

          <DrawCanvas
            key={canvasKey}
            width={760}
            height={280}
            onRecognize={handleRecognize}
            strokeColor={settings.penColor}
            disabled={state !== 'drawing'}
            debugGuess
          />

          {state === 'correct' && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(60,230,122,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'correctPulse 0.9s ease-out',
              }}
            >
              <div
                style={{
                  background: '#3ce67a',
                  border: '6px solid #0a0a14',
                  padding: '20px 40px',
                  boxShadow: '0 0 40px #3ce67a, 0 8px 0 #0a0a14',
                }}
              >
                <div
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 36,
                    color: '#0a0a14',
                    textShadow: '3px 3px 0 #fff',
                    letterSpacing: 3,
                  }}
                >
                  ✓ NICE!
                </div>
                <div
                  style={{
                    fontFamily: "'VT323', monospace",
                    fontSize: 22,
                    color: '#0a0a14',
                    textAlign: 'center',
                    marginTop: 6,
                    letterSpacing: 2,
                  }}
                >
                  +10 POINTS · +1 STAR
                </div>
              </div>
              {Array.from({ length: 14 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: `${30 + Math.random() * 40}%`,
                    top: `${30 + Math.random() * 40}%`,
                    width: 8,
                    height: 8,
                    background: (['#ffd93d', '#4cf1ff', '#ff9ec7', '#3ce67a'] as const)[i % 4],
                    animation: `particle${i % 4} 0.8s ease-out forwards`,
                  }}
                />
              ))}
            </div>
          )}

          {state === 'wrong' && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(255,46,99,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <div
                style={{
                  background: '#ff2e63',
                  border: '6px solid #0a0a14',
                  padding: '16px 32px',
                  boxShadow: '0 0 30px #ff2e63, 0 8px 0 #0a0a14',
                }}
              >
                <div
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 28,
                    color: '#fff',
                    textShadow: '3px 3px 0 #0a0a14',
                    letterSpacing: 2,
                  }}
                >
                  ✗ OOPS!
                </div>
              </div>
              <div
                style={{
                  fontFamily: "'VT323', monospace",
                  fontSize: 26,
                  color: '#ffd93d',
                  letterSpacing: 2,
                  textShadow: '2px 2px 0 #0a0a14',
                }}
              >
                {lastGuess !== null && `YOU WROTE ${lastGuess} · `}TRY AGAIN!
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          marginTop: 16,
          textAlign: 'center',
          position: 'relative',
          zIndex: 2,
          fontFamily: "'VT323', monospace",
          fontSize: 20,
          color: '#8a8aad',
          letterSpacing: 2,
        }}
      >
        ✎ USE THE APPLE PENCIL · AUTO-ADVANCES WHEN CORRECT
      </div>
    </div>
  );
}
