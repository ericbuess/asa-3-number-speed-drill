export const P = {
  K: '#0a0a14',
  W: '#ffffff',
  Y: '#ffd93d',
  O: '#ff7a1f',
  R: '#ff2e63',
  M: '#b83dff',
  B: '#3da5ff',
  C: '#4cf1ff',
  G: '#3ce67a',
  N: '#2d2d5c',
  S: '#8a8aad',
  D: '#d4d4e8',
  T: '#7a3ea1',
  E: '#ff9ec7',
} as const;

export type PaletteKey = keyof typeof P;

export const RARITY_COLOR = {
  common: P.S,
  rare: P.C,
  epic: P.M,
  legendary: P.Y,
} as const;
