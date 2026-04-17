import { ArcadeButton } from '../ui/ArcadeButton';
import { PixelText } from '../ui/PixelText';
import { StarField } from '../ui/StarField';
import type { SessionMode, Settings } from '../types';

interface Props {
  onBack: () => void;
  settings: Settings;
  setSettings: (update: (s: Settings) => Settings) => void;
}

const SESSION_OPTIONS: { id: SessionMode; label: string; sub: string }[] = [
  { id: '60s', label: '60 SECONDS', sub: 'HOW MANY CAN YOU GET?' },
  { id: '20p', label: '20 PROBLEMS', sub: 'BEAT YOUR BEST TIME' },
  { id: '30s', label: '30 SECONDS', sub: 'FAST SPRINT' },
];

const PEN_COLORS: { id: string; name: string }[] = [
  { id: '#4cf1ff', name: 'ICE' },
  { id: '#ff2e63', name: 'FIRE' },
  { id: '#ffd93d', name: 'SUN' },
  { id: '#3ce67a', name: 'LEAF' },
  { id: '#b83dff', name: 'NOVA' },
];

export function SettingsScreen({ onBack, settings, setSettings }: Props) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(180deg, #0a0a14 0%, #1a0a3e 100%)',
        position: 'relative',
        padding: 48,
        boxSizing: 'border-box',
        overflow: 'auto',
      }}
    >
      <StarField count={30} />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          marginBottom: 32,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <ArcadeButton onClick={onBack} color="#8a8aad" size="sm">
          ← BACK
        </ArcadeButton>
        <PixelText size={32} color="#ffd93d" shadow="#ff2e63">
          SETTINGS
        </PixelText>
      </div>

      <div style={{ position: 'relative', zIndex: 2, marginBottom: 32 }}>
        <PixelText size={16} color="#4cf1ff" shadow={null}>
          ◆ SESSION LENGTH
        </PixelText>
        <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
          {SESSION_OPTIONS.map((opt) => {
            const active = settings.session === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSettings((s) => ({ ...s, session: opt.id }))}
                style={{
                  flex: 1,
                  padding: '20px 16px',
                  background: active ? '#ff2e63' : '#1a1a2e',
                  border: active ? '4px solid #ffd93d' : '4px solid #2d2d5c',
                  cursor: 'pointer',
                  boxShadow: active
                    ? '0 0 0 4px #0a0a14, 0 6px 0 4px #0a0a14'
                    : '0 4px 0 #0a0a14',
                }}
              >
                <div
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 14,
                    color: '#fff',
                    letterSpacing: 1,
                  }}
                >
                  {opt.label}
                </div>
                <div
                  style={{
                    fontFamily: "'VT323', monospace",
                    fontSize: 18,
                    color: active ? '#0a0a14' : '#8a8aad',
                    marginTop: 8,
                    letterSpacing: 1,
                  }}
                >
                  {opt.sub}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 2, marginBottom: 32 }}>
        <PixelText size={16} color="#4cf1ff" shadow={null}>
          ◆ PROBLEM TYPE
        </PixelText>
        <div
          style={{
            marginTop: 16,
            padding: '18px 20px',
            background: '#1a1a2e',
            border: '4px solid #2d2d5c',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 13,
                color: '#fff',
              }}
            >
              3 SINGLE DIGITS + / −
            </div>
            <div
              style={{
                fontFamily: "'VT323', monospace",
                fontSize: 20,
                color: '#8a8aad',
                marginTop: 6,
              }}
            >
              EXAMPLE: 7 + 3 − 2 = ?
            </div>
          </div>
          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 9,
              color: '#ffd93d',
              border: '3px solid #ffd93d',
              padding: '6px 10px',
            }}
          >
            LV 1
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 2, marginBottom: 32 }}>
        <PixelText size={16} color="#4cf1ff" shadow={null}>
          ◆ PENCIL COLOR
        </PixelText>
        <div style={{ display: 'flex', gap: 14, marginTop: 16 }}>
          {PEN_COLORS.map((c) => {
            const active = settings.penColor === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSettings((s) => ({ ...s, penColor: c.id }))}
                style={{
                  flex: 1,
                  padding: 16,
                  background: '#1a1a2e',
                  border: active ? '4px solid #ffd93d' : '4px solid #2d2d5c',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: 32,
                    background: c.id,
                    boxShadow: `0 0 12px ${c.id}`,
                  }}
                />
                <div
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 9,
                    color: active ? '#ffd93d' : '#fff',
                    marginTop: 10,
                    letterSpacing: 1,
                  }}
                >
                  {c.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: 16 }}>
        <ToggleRow
          label="ARCADE SOUNDS"
          value={settings.sound}
          onChange={(v) => setSettings((s) => ({ ...s, sound: v }))}
        />
        <ToggleRow
          label="HAPTICS"
          value={settings.haptics}
          onChange={(v) => setSettings((s) => ({ ...s, haptics: v }))}
        />
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        flex: 1,
        padding: '16px 20px',
        background: '#1a1a2e',
        border: '4px solid #2d2d5c',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
      }}
    >
      <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 12, color: '#fff' }}>
        {label}
      </div>
      <div
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 11,
          background: value ? '#3ce67a' : '#8a8aad',
          color: '#0a0a14',
          padding: '6px 12px',
          border: '3px solid #0a0a14',
        }}
      >
        {value ? 'ON' : 'OFF'}
      </div>
    </button>
  );
}
