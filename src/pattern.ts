import type { EmotionCard, MoodEntry } from './types';

export interface MoodPatternResult {
  cycleDays: number;
  confidence: number; // 0-1, autocorrelation strength at the detected lag
}

const MIN_ENTRIES = 10;
const MIN_SPAN_DAYS = 14;
const MIN_LAG = 2;
const MAX_LAG = 21;
const CONFIDENCE_THRESHOLD = 0.3;

function dayKey(iso: string) {
  return iso.split('T')[0];
}

/**
 * Detects a rough mood cycle length via autocorrelation on a daily score
 * series (direction * intensity), linearly interpolating days without entries.
 */
export function analyzeMoodPattern(entries: MoodEntry[], emotionCards: EmotionCard[]): MoodPatternResult | null {
  if (entries.length < MIN_ENTRIES) return null;

  const dirMap = Object.fromEntries(emotionCards.map(c => [c.id, c.direction ?? -1]));

  const byDay = new Map<string, number[]>();
  for (const e of entries) {
    const key = dayKey(e.date);
    const dir = dirMap[e.emotion] ?? -1;
    const score = dir * e.intensity;
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key)!.push(score);
  }

  const days = [...byDay.keys()].sort();
  const start = new Date(days[0] + 'T00:00:00');
  const end = new Date(days[days.length - 1] + 'T00:00:00');
  const spanDays = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
  if (spanDays < MIN_SPAN_DAYS) return null;

  const dailyAvg = new Map<string, number>();
  byDay.forEach((scores, key) => dailyAvg.set(key, scores.reduce((a, b) => a + b, 0) / scores.length));

  // Build a continuous daily series, linearly interpolating gaps.
  const series: number[] = new Array(spanDays).fill(NaN);
  for (let i = 0; i < spanDays; i++) {
    const d = new Date(start.getTime() + i * 86400000);
    const key = dayKey(d.toISOString());
    if (dailyAvg.has(key)) series[i] = dailyAvg.get(key)!;
  }
  // Interpolate NaN gaps between known points; edges use nearest known value.
  let lastKnown = series.findIndex(v => !Number.isNaN(v));
  if (lastKnown === -1) return null;
  for (let i = 0; i < lastKnown; i++) series[i] = series[lastKnown];
  for (let i = lastKnown + 1; i < spanDays; i++) {
    if (!Number.isNaN(series[i])) { lastKnown = i; continue; }
    let next = i;
    while (next < spanDays && Number.isNaN(series[next])) next++;
    if (next === spanDays) {
      for (let j = i; j < spanDays; j++) series[j] = series[lastKnown];
      break;
    }
    const gapLen = next - lastKnown;
    for (let j = lastKnown + 1; j < next; j++) {
      const t = (j - lastKnown) / gapLen;
      series[j] = series[lastKnown] * (1 - t) + series[next] * t;
    }
    i = next - 1;
  }

  const n = series.length;
  const mean = series.reduce((a, b) => a + b, 0) / n;
  const centered = series.map(v => v - mean);
  const denom = centered.reduce((s, v) => s + v * v, 0);
  if (denom === 0) return null;

  const maxLag = Math.min(MAX_LAG, Math.floor(n / 2));
  let bestLag = 0;
  let bestR = -Infinity;
  for (let lag = MIN_LAG; lag <= maxLag; lag++) {
    let num = 0;
    for (let t = 0; t < n - lag; t++) num += centered[t] * centered[t + lag];
    const r = num / denom;
    if (r > bestR) { bestR = r; bestLag = lag; }
  }

  if (bestR < CONFIDENCE_THRESHOLD) return null;
  return { cycleDays: bestLag, confidence: Math.min(1, bestR) };
}
