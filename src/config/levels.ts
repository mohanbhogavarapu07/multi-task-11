import { LevelConfig } from '@/types/game';

export const LEVEL_CONFIGS: LevelConfig[] = [
  // Level 1 - Very Slow / Very Slow
  { level: 1, objectSpeed: 0.8, objectDrift: 0.3, statementTimeMs: 4000, statementComplexity: 'simple' },
  // Level 2 - Very Slow / Slow
  { level: 2, objectSpeed: 1.0, objectDrift: 0.4, statementTimeMs: 3500, statementComplexity: 'simple' },
  // Level 3 - Slow / Slow
  { level: 3, objectSpeed: 1.3, objectDrift: 0.5, statementTimeMs: 3200, statementComplexity: 'simple' },
  // Level 4 - Slow / Medium
  { level: 4, objectSpeed: 1.6, objectDrift: 0.6, statementTimeMs: 2800, statementComplexity: 'medium' },
  // Level 5 - Medium / Medium
  { level: 5, objectSpeed: 2.0, objectDrift: 0.7, statementTimeMs: 2500, statementComplexity: 'medium' },
  // Level 6 - Medium / Fast
  { level: 6, objectSpeed: 2.3, objectDrift: 0.8, statementTimeMs: 2200, statementComplexity: 'medium' },
  // Level 7 - Medium-Fast / Fast
  { level: 7, objectSpeed: 2.7, objectDrift: 0.9, statementTimeMs: 2000, statementComplexity: 'complex' },
  // Level 8 - Fast / Fast
  { level: 8, objectSpeed: 3.2, objectDrift: 1.0, statementTimeMs: 1800, statementComplexity: 'complex' },
  // Level 9 - Fast / Very Fast
  { level: 9, objectSpeed: 3.6, objectDrift: 1.1, statementTimeMs: 1600, statementComplexity: 'complex' },
  // Level 10 - Very Fast / Very Fast
  { level: 10, objectSpeed: 4.0, objectDrift: 1.2, statementTimeMs: 1400, statementComplexity: 'complex' },
  // Level 11 - Very Fast / Extreme
  { level: 11, objectSpeed: 4.5, objectDrift: 1.4, statementTimeMs: 1200, statementComplexity: 'absurd' },
  // Level 12 - Extreme / Extreme
  { level: 12, objectSpeed: 5.0, objectDrift: 1.6, statementTimeMs: 1000, statementComplexity: 'absurd' },
  // Level 13 - Extreme / Random Burst
  { level: 13, objectSpeed: 5.5, objectDrift: 1.8, statementTimeMs: 900, statementComplexity: 'absurd' },
  // Level 14 - Extreme / Random Burst
  { level: 14, objectSpeed: 6.0, objectDrift: 2.0, statementTimeMs: 800, statementComplexity: 'absurd' },
  // Level 15 - Brutal / Chaotic
  { level: 15, objectSpeed: 7.0, objectDrift: 2.5, statementTimeMs: 700, statementComplexity: 'absurd' },
];

export function getLevelConfig(level: number): LevelConfig {
  const clampedLevel = Math.max(1, Math.min(15, level));
  return LEVEL_CONFIGS[clampedLevel - 1];
}

export const SESSION_DURATION_MS = 30000; // 30 seconds per session

export const BOUNDARY_PADDING = 40; // pixels from edge
