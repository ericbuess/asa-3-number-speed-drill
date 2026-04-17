// 8x8 hand-tuned prototypes per digit — written to look like how a 6-8yo would draw.
// Ported from the design prototype's draw.jsx.

export interface Point {
  x: number;
  y: number;
}

export type Stroke = Point[];

const DIGIT_PROTOS: Record<number, string[]> = {
  0: [
    '.XXXXXX.',
    'XX....XX',
    'XX....XX',
    'XX....XX',
    'XX....XX',
    'XX....XX',
    'XX....XX',
    '.XXXXXX.',
  ],
  1: [
    '...XXX..',
    '..XXXX..',
    '....XX..',
    '....XX..',
    '....XX..',
    '....XX..',
    '....XX..',
    '..XXXXXX',
  ],
  2: [
    '.XXXXXX.',
    'XX....XX',
    '......XX',
    '....XXX.',
    '..XXX...',
    '.XX.....',
    'XX......',
    'XXXXXXXX',
  ],
  3: [
    '.XXXXXX.',
    'XX....XX',
    '......XX',
    '..XXXXX.',
    '......XX',
    '......XX',
    'XX....XX',
    '.XXXXXX.',
  ],
  4: [
    '.....XX.',
    '....XXX.',
    '...XXXX.',
    '..XX.XX.',
    '.XX..XX.',
    'XXXXXXXX',
    '.....XX.',
    '.....XX.',
  ],
  5: [
    'XXXXXXXX',
    'XX......',
    'XX......',
    'XXXXXXX.',
    '.......X',
    '.......X',
    'XX.....X',
    '.XXXXXX.',
  ],
  6: [
    '..XXXXX.',
    '.XX.....',
    'XX......',
    'XXXXXX..',
    'XX....XX',
    'XX....XX',
    'XX....XX',
    '.XXXXXX.',
  ],
  7: [
    'XXXXXXXX',
    '......XX',
    '.....XX.',
    '....XX..',
    '...XX...',
    '..XX....',
    '..XX....',
    '..XX....',
  ],
  8: [
    '.XXXXXX.',
    'XX....XX',
    'XX....XX',
    '.XXXXXX.',
    'XX....XX',
    'XX....XX',
    'XX....XX',
    '.XXXXXX.',
  ],
  9: [
    '.XXXXXX.',
    'XX....XX',
    'XX....XX',
    '.XXXXXXX',
    '......XX',
    '......XX',
    '.....XX.',
    '.XXXXX..',
  ],
};

interface BBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  w: number;
  h: number;
}

function getBBox(points: Point[]): BBox | null {
  if (!points.length) return null;
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  return { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY };
}

function rasterize(strokes: Stroke[]): { grid: number[][]; bbox: BBox } | null {
  const allPts = strokes.flat();
  const bbox = getBBox(allPts);
  if (!bbox || bbox.w < 5 || bbox.h < 5) return null;

  const pad = 4;
  const W = bbox.w + pad * 2;
  const H = bbox.h + pad * 2;
  const grid: number[][] = Array.from({ length: 8 }, () => Array(8).fill(0));
  const scale = 8;
  for (const stroke of strokes) {
    for (let i = 0; i < stroke.length - 1; i++) {
      const a = stroke[i];
      const b = stroke[i + 1];
      const steps = Math.ceil(Math.hypot(b.x - a.x, b.y - a.y));
      for (let s = 0; s <= steps; s++) {
        const t = steps === 0 ? 0 : s / steps;
        const x = a.x + (b.x - a.x) * t - bbox.minX + pad;
        const y = a.y + (b.y - a.y) * t - bbox.minY + pad;
        const gx = Math.floor((x / W) * scale);
        const gy = Math.floor((y / H) * scale);
        if (gx >= 0 && gx < 8 && gy >= 0 && gy < 8) grid[gy][gx] = 1;
      }
    }
  }
  return { grid, bbox };
}

function matchScore(grid: number[][], proto: string[]): number {
  let match = 0;
  let total = 0;
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const a = grid[y][x];
      const b = proto[y][x] === 'X' ? 1 : 0;
      if (a === b) match++;
      total++;
    }
  }
  return match / total;
}

function recognizeDigit(strokes: Stroke[]): number | null {
  const r = rasterize(strokes);
  if (!r) return null;
  let best: { digit: number | null; score: number } = { digit: null, score: 0 };
  for (const [d, proto] of Object.entries(DIGIT_PROTOS)) {
    const score = matchScore(r.grid, proto);
    if (score > best.score) {
      best = { digit: parseInt(d, 10), score };
    }
  }
  return best.score > 0.62 ? best.digit : null;
}

export function recognizeNumber(strokes: Stroke[]): number | null {
  if (!strokes.length) return null;
  const perStrokeBBox = strokes.map(getBBox);
  let hasMinus = false;
  const digitStrokes: { stroke: Stroke; bbox: BBox }[] = [];
  for (let i = 0; i < strokes.length; i++) {
    const b = perStrokeBBox[i];
    if (!b) continue;
    if (b.w > 20 && b.h < 10 && b.w > b.h * 3) {
      hasMinus = true;
    } else {
      digitStrokes.push({ stroke: strokes[i], bbox: b });
    }
  }
  if (!digitStrokes.length) return null;

  digitStrokes.sort((a, b) => a.bbox.minX - b.bbox.minX);
  const clusters: { strokes: Stroke[]; bbox: BBox }[] = [];
  for (const ds of digitStrokes) {
    const last = clusters[clusters.length - 1];
    if (last && ds.bbox.minX < last.bbox.maxX + 15) {
      last.strokes.push(ds.stroke);
      last.bbox.maxX = Math.max(last.bbox.maxX, ds.bbox.maxX);
      last.bbox.minY = Math.min(last.bbox.minY, ds.bbox.minY);
      last.bbox.maxY = Math.max(last.bbox.maxY, ds.bbox.maxY);
    } else {
      clusters.push({ strokes: [ds.stroke], bbox: { ...ds.bbox } });
    }
  }

  const digits: number[] = [];
  for (const c of clusters) {
    const d = recognizeDigit(c.strokes);
    if (d === null) return null;
    digits.push(d);
  }
  const n = parseInt(digits.join(''), 10);
  if (Number.isNaN(n)) return null;
  return hasMinus ? -n : n;
}
