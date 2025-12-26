import { useState, useEffect, useCallback, useRef } from 'react';
import { Statement } from '@/types/game';
import { getMixedStatement } from '@/data/statements';
import { getLevelConfig } from '@/config/levels';

interface SemanticState {
  currentStatement: Statement | null;
  timeRemaining: number;
  correctCount: number;
  totalCount: number;
}

export function useSemanticTask(
  level: number,
  isActive: boolean,
  onWrongAnswer: () => void,
  onTimeout: () => void
) {
  const [state, setState] = useState<SemanticState>({
    currentStatement: null,
    timeRemaining: 1,
    correctCount: 0,
    totalCount: 0,
  });
  
  const timerRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>(0);
  const config = getLevelConfig(level);
  const lastResponseTimeRef = useRef<number>(0);
  const switchCostLatenciesRef = useRef<number[]>([]);

  // Generate new statement
  const generateStatement = useCallback(() => {
    const statement = getMixedStatement(level);
    startTimeRef.current = Date.now();
    
    setState(prev => ({
      ...prev,
      currentStatement: statement,
      timeRemaining: 1,
    }));
  }, [level]);

  // Handle answer
  const handleAnswer = useCallback((answeredTrue: boolean) => {
    if (!state.currentStatement || !isActive) return;

    const responseTime = Date.now() - startTimeRef.current;
    
    // Track switch cost latency
    if (lastResponseTimeRef.current > 0) {
      const latency = Date.now() - lastResponseTimeRef.current;
      switchCostLatenciesRef.current.push(latency);
    }
    lastResponseTimeRef.current = Date.now();

    const isCorrect = answeredTrue === state.currentStatement.isTrue;

    if (!isCorrect) {
      onWrongAnswer();
      return;
    }

    setState(prev => ({
      ...prev,
      correctCount: prev.correctCount + 1,
      totalCount: prev.totalCount + 1,
    }));

    // Generate next statement
    generateStatement();
  }, [state.currentStatement, isActive, onWrongAnswer, generateStatement]);

  // Handle keyboard input for answers
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'a' || e.key === 'A') {
        handleAnswer(true);
      } else if (e.key === 's' || e.key === 'S') {
        handleAnswer(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, handleAnswer]);

  // Timer for current statement
  useEffect(() => {
    if (!isActive || !state.currentStatement) return;

    const interval = setInterval(() => {
      setState(prev => {
        const elapsed = Date.now() - startTimeRef.current;
        const remaining = Math.max(0, 1 - elapsed / config.statementTimeMs);

        if (remaining <= 0) {
          onTimeout();
          return prev;
        }

        return { ...prev, timeRemaining: remaining };
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isActive, state.currentStatement, config.statementTimeMs, onTimeout]);

  // Start generating statements when active
  useEffect(() => {
    if (isActive && !state.currentStatement) {
      generateStatement();
    }
  }, [isActive, state.currentStatement, generateStatement]);

  const reset = useCallback(() => {
    setState({
      currentStatement: null,
      timeRemaining: 1,
      correctCount: 0,
      totalCount: 0,
    });
    switchCostLatenciesRef.current = [];
    lastResponseTimeRef.current = 0;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  const getSwitchCostLatencies = useCallback(() => {
    return [...switchCostLatenciesRef.current];
  }, []);

  return {
    currentStatement: state.currentStatement,
    timeRemaining: state.timeRemaining,
    correctCount: state.correctCount,
    totalCount: state.totalCount,
    handleAnswer,
    reset,
    getSwitchCostLatencies,
  };
}
