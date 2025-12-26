export type GameState = 
  | 'INIT' 
  | 'INSTRUCTIONS' 
  | 'TASK_SETUP' 
  | 'ACTIVE_MULTITASK' 
  | 'FAILURE' 
  | 'SUCCESS' 
  | 'PERFORMANCE_EVALUATION' 
  | 'RESULT';

export type FailureReason = 'BOUNDARY_VIOLATION' | 'WRONG_ANSWER' | 'TIMEOUT' | null;

export interface Statement {
  text: string;
  isTrue: boolean;
}

export interface LevelConfig {
  level: number;
  objectSpeed: number; // pixels per frame
  objectDrift: number; // random drift intensity
  statementTimeMs: number; // time to answer
  statementComplexity: 'simple' | 'medium' | 'complex' | 'absurd';
}

export interface SessionMetrics {
  survivalTimeMs: number;
  semanticCorrect: number;
  semanticTotal: number;
  boundaryViolations: number;
  switchCostLatencies: number[];
  fastJumpEligible: boolean;
}

export interface PersistedStats {
  highestLevel: number;
  longestSurvivalMs: number;
  totalSessions: number;
  fastJumpEvents: number;
  accuracyHistory: number[];
}

export type LevelChange = 'FAST_JUMP' | 'LEVEL_UP' | 'STAY' | 'LEVEL_DOWN';
