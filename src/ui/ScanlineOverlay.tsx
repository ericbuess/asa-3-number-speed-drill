interface Props {
  intensity?: number;
}

export function ScanlineOverlay({ intensity = 0.15 }: Props) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `repeating-linear-gradient(
          0deg,
          rgba(0,0,0,${intensity}) 0px,
          rgba(0,0,0,${intensity}) 1px,
          transparent 1px,
          transparent 3px
        )`,
        pointerEvents: 'none',
        zIndex: 100,
        mixBlendMode: 'multiply',
      }}
    />
  );
}
