import { useCallback } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { InitScreen } from './game/InitScreen';
import { InstructionsScreen } from './game/InstructionsScreen';
import { TaskSetupScreen } from './game/TaskSetupScreen';
import { ActiveGame } from './game/ActiveGame';
import { ResultScreen } from './game/ResultScreen';
import { FailureReason, SessionMetrics } from '@/types/game';

export function MultiTaskChallenge() {
  const {
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
    evaluatePerformance,
    resetToInit,
    resetStats,
  } = useGameState();

  const handleFailure = useCallback((reason: FailureReason, metrics: SessionMetrics) => {
    triggerFailure(reason);
    // Small delay before evaluation
    setTimeout(() => {
      evaluatePerformance(metrics);
    }, 100);
  }, [triggerFailure, evaluatePerformance]);

  const handleSuccess = useCallback((metrics: SessionMetrics) => {
    evaluatePerformance(metrics);
  }, [evaluatePerformance]);

  return (
    <div className="min-h-screen bg-background">
      {gameState === 'INIT' && (
        <InitScreen
          stats={persistedStats}
          currentLevel={currentLevel}
          onStart={startInstructions}
          onResetStats={resetStats}
        />
      )}

      {gameState === 'INSTRUCTIONS' && (
        <InstructionsScreen onContinue={startTaskSetup} />
      )}

      {gameState === 'TASK_SETUP' && (
        <TaskSetupScreen level={currentLevel} onReady={startActiveGame} />
      )}

      {(gameState === 'ACTIVE_MULTITASK' || gameState === 'FAILURE' || gameState === 'SUCCESS') && (
        <ActiveGame
          level={currentLevel}
          onFailure={handleFailure}
          onSuccess={handleSuccess}
        />
      )}

      {(gameState === 'PERFORMANCE_EVALUATION' || gameState === 'RESULT') && (
        <ResultScreen
          metrics={sessionMetrics}
          levelChange={levelChange}
          currentLevel={currentLevel}
          failureReason={failureReason}
          onContinue={resetToInit}
        />
      )}
    </div>
  );
}
