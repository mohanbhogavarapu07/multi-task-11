import { useState, useEffect, useCallback, useRef } from 'react';
import { VisuospatialZone } from './VisuospatialZone';
import { SemanticZone } from './SemanticZone';
import { GameHUD } from './GameHUD';
import { FailureScreen } from './FailureScreen';
import { useVisuospatialTask } from '@/hooks/useVisuospatialTask';
import { useSemanticTask } from '@/hooks/useSemanticTask';
import { FailureReason, SessionMetrics } from '@/types/game';
import { SESSION_DURATION_MS } from '@/config/levels';

interface ActiveGameProps {
  level: number;
  onFailure: (reason: FailureReason, metrics: SessionMetrics) => void;
  onSuccess: (metrics: SessionMetrics) => void;
}

export function ActiveGame({ level, onFailure, onSuccess }: ActiveGameProps) {
  const [zoneHeight, setZoneHeight] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [failureReason, setFailureReason] = useState<FailureReason>(null);
  const startTimeRef = useRef<number>(0);
  const boundaryViolationsRef = useRef(0);

  // Start the game after a brief delay
  useEffect(() => {
    const timer = setTimeout(() => {
      startTimeRef.current = Date.now();
      setIsActive(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Handle boundary violation
  const handleBoundaryViolation = useCallback(() => {
    if (hasEnded) return;
    boundaryViolationsRef.current += 1;
    setHasEnded(true);
    setIsActive(false);
    setFailureReason('BOUNDARY_VIOLATION');
  }, [hasEnded]);

  // Handle wrong answer
  const handleWrongAnswer = useCallback(() => {
    if (hasEnded) return;
    setHasEnded(true);
    setIsActive(false);
    setFailureReason('WRONG_ANSWER');
  }, [hasEnded]);

  // Handle timeout
  const handleTimeout = useCallback(() => {
    if (hasEnded) return;
    setHasEnded(true);
    setIsActive(false);
    setFailureReason('TIMEOUT');
  }, [hasEnded]);

  const visuospatial = useVisuospatialTask(
    level,
    isActive,
    zoneHeight,
    handleBoundaryViolation
  );

  const semantic = useSemanticTask(
    level,
    isActive,
    handleWrongAnswer,
    handleTimeout
  );

  // Check for session completion
  useEffect(() => {
    if (!isActive || hasEnded) return;

    const checkCompletion = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      if (elapsed >= SESSION_DURATION_MS) {
        setHasEnded(true);
        setIsActive(false);
        
        const metrics: SessionMetrics = {
          survivalTimeMs: elapsed,
          semanticCorrect: semantic.correctCount,
          semanticTotal: semantic.totalCount,
          boundaryViolations: boundaryViolationsRef.current,
          switchCostLatencies: semantic.getSwitchCostLatencies(),
          fastJumpEligible: true, // Survived full session
        };
        
        onSuccess(metrics);
      }
    }, 100);

    return () => clearInterval(checkCompletion);
  }, [isActive, hasEnded, semantic, onSuccess]);

  // Handle failure with delay for dramatic effect
  useEffect(() => {
    if (!failureReason || !hasEnded) return;

    const timer = setTimeout(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const metrics: SessionMetrics = {
        survivalTimeMs: elapsed,
        semanticCorrect: semantic.correctCount,
        semanticTotal: semantic.totalCount,
        boundaryViolations: boundaryViolationsRef.current,
        switchCostLatencies: semantic.getSwitchCostLatencies(),
        fastJumpEligible: false,
      };
      
      onFailure(failureReason, metrics);
    }, 1500);

    return () => clearTimeout(timer);
  }, [failureReason, hasEnded, semantic, onFailure]);

  const handleHeightChange = useCallback((height: number) => {
    setZoneHeight(height);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* HUD */}
      <GameHUD
        level={level}
        startTime={startTimeRef.current}
        isActive={isActive}
        sessionDuration={SESSION_DURATION_MS}
      />

      {/* Game Zones */}
      <div className="flex-1 grid grid-cols-2 pt-16">
        <VisuospatialZone
          position={visuospatial.position}
          boundaryTop={visuospatial.boundaryTop}
          boundaryBottom={visuospatial.boundaryBottom}
          objectSize={visuospatial.objectSize}
          inputDirection={visuospatial.inputDirection}
          onHeightChange={handleHeightChange}
        />
        <SemanticZone
          statement={semantic.currentStatement}
          timeRemaining={semantic.timeRemaining}
          correctCount={semantic.correctCount}
          totalCount={semantic.totalCount}
        />
      </div>

      {/* Failure Overlay */}
      {failureReason && <FailureScreen reason={failureReason} />}
    </div>
  );
}
