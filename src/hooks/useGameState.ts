import { useState, useCallback } from 'react';
import { GameState, FailureReason, SessionMetrics, PersistedStats, LevelChange } from '@/types/game';

const STORAGE_KEY = 'multitask_challenge_stats';

const defaultStats: PersistedStats = {
  highestLevel: 1,
  longestSurvivalMs: 0,
  totalSessions: 0,
  fastJumpEvents: 0,
  accuracyHistory: [],
};

function loadStats(): PersistedStats {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...defaultStats, ...JSON.parse(saved) };
    }
  } catch {
    // Ignore errors
  }
  return defaultStats;
}

function saveStats(stats: PersistedStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // Ignore errors
  }
}

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>('INIT');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [failureReason, setFailureReason] = useState<FailureReason>(null);
  const [sessionMetrics, setSessionMetrics] = useState<SessionMetrics | null>(null);
  const [persistedStats, setPersistedStats] = useState<PersistedStats>(loadStats);
  const [levelChange, setLevelChange] = useState<LevelChange | null>(null);

  const startInstructions = useCallback(() => {
    setGameState('INSTRUCTIONS');
    setFailureReason(null);
    setSessionMetrics(null);
    setLevelChange(null);
  }, []);

  const startTaskSetup = useCallback(() => {
    setGameState('TASK_SETUP');
  }, []);

  const startActiveGame = useCallback(() => {
    setGameState('ACTIVE_MULTITASK');
  }, []);

  const triggerFailure = useCallback((reason: FailureReason) => {
    setFailureReason(reason);
    setGameState('FAILURE');
  }, []);

  const triggerSuccess = useCallback(() => {
    setGameState('SUCCESS');
  }, []);

  const evaluatePerformance = useCallback((metrics: SessionMetrics) => {
    setSessionMetrics(metrics);
    setGameState('PERFORMANCE_EVALUATION');

    const accuracy = metrics.semanticTotal > 0 
      ? (metrics.semanticCorrect / metrics.semanticTotal) * 100 
      : 0;

    let change: LevelChange;
    let newLevel = currentLevel;

    // Determine level change
    if (metrics.fastJumpEligible && accuracy >= 95 && metrics.boundaryViolations === 0) {
      // Fast jump: +2 levels
      change = 'FAST_JUMP';
      newLevel = Math.min(15, currentLevel + 2);
    } else if (accuracy >= 80 && metrics.boundaryViolations === 0) {
      // Normal level up
      change = 'LEVEL_UP';
      newLevel = Math.min(15, currentLevel + 1);
    } else if (accuracy >= 60) {
      // Stay at current level
      change = 'STAY';
    } else {
      // Level down (max 1 level)
      change = 'LEVEL_DOWN';
      newLevel = Math.max(1, currentLevel - 1);
    }

    setLevelChange(change);
    setCurrentLevel(newLevel);

    // Update persisted stats
    const newStats: PersistedStats = {
      highestLevel: Math.max(persistedStats.highestLevel, newLevel),
      longestSurvivalMs: Math.max(persistedStats.longestSurvivalMs, metrics.survivalTimeMs),
      totalSessions: persistedStats.totalSessions + 1,
      fastJumpEvents: persistedStats.fastJumpEvents + (change === 'FAST_JUMP' ? 1 : 0),
      accuracyHistory: [...persistedStats.accuracyHistory.slice(-19), accuracy],
    };
    setPersistedStats(newStats);
    saveStats(newStats);

    // Transition to result after brief delay
    setTimeout(() => {
      setGameState('RESULT');
    }, 500);
  }, [currentLevel, persistedStats]);

  const resetToInit = useCallback(() => {
    setGameState('INIT');
    setFailureReason(null);
    setSessionMetrics(null);
    setLevelChange(null);
  }, []);

  const resetStats = useCallback(() => {
    setPersistedStats(defaultStats);
    saveStats(defaultStats);
    setCurrentLevel(1);
  }, []);

  return {
    gameState,
    currentLevel,
    failureReason,
    sessionMetrics,
    persistedStats,
    levelChange,
    startInstructions,
    startTaskSetup,
    startActiveGame,
    triggerFailure,
    triggerSuccess,
    evaluatePerformance,
    resetToInit,
    resetStats,
  };
}
