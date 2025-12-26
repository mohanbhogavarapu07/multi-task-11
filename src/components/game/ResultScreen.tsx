import { SessionMetrics, LevelChange, FailureReason } from '@/types/game';

interface ResultScreenProps {
  metrics: SessionMetrics | null;
  levelChange: LevelChange | null;
  currentLevel: number;
  failureReason: FailureReason;
  onContinue: () => void;
}

export function ResultScreen({
  metrics,
  levelChange,
  currentLevel,
  failureReason,
  onContinue,
}: ResultScreenProps) {
  if (!metrics) return null;

  const accuracy = metrics.semanticTotal > 0
    ? (metrics.semanticCorrect / metrics.semanticTotal) * 100
    : 0;

  const getLevelChangeDisplay = () => {
    switch (levelChange) {
      case 'FAST_JUMP':
        return { text: '↑↑', color: 'text-success', label: 'FAST JUMP +2' };
      case 'LEVEL_UP':
        return { text: '↑', color: 'text-success', label: 'LEVEL UP' };
      case 'STAY':
        return { text: '→', color: 'text-muted-foreground', label: 'LEVEL STAY' };
      case 'LEVEL_DOWN':
        return { text: '↓', color: 'text-destructive', label: 'LEVEL DOWN' };
      default:
        return { text: '-', color: 'text-muted-foreground', label: '' };
    }
  };

  const changeDisplay = getLevelChangeDisplay();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 animate-fade-in">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="clinical-display">SESSION COMPLETE</div>
          <div className={`text-5xl font-mono font-bold ${changeDisplay.color}`}>
            {changeDisplay.text}
          </div>
          <div className={`font-mono text-sm ${changeDisplay.color}`}>
            {changeDisplay.label}
          </div>
        </div>

        {/* Level Badge */}
        <div className="flex justify-center">
          <div className="level-badge text-lg px-6 py-2">
            LEVEL {currentLevel.toString().padStart(2, '0')}
          </div>
        </div>

        {/* Metrics */}
        <div className="bg-card border border-border rounded-sm p-6 space-y-1">
          <div className="result-metric">
            <span className="clinical-display">Survival Time</span>
            <span className="clinical-value">
              {(metrics.survivalTimeMs / 1000).toFixed(2)}s
            </span>
          </div>

          <div className="result-metric">
            <span className="clinical-display">Semantic Accuracy</span>
            <span className={`clinical-value ${accuracy >= 80 ? 'text-success' : accuracy >= 60 ? 'text-zone-right' : 'text-destructive'}`}>
              {accuracy.toFixed(1)}%
            </span>
          </div>

          <div className="result-metric">
            <span className="clinical-display">Correct / Total</span>
            <span className="clinical-value">
              {metrics.semanticCorrect} / {metrics.semanticTotal}
            </span>
          </div>

          <div className="result-metric">
            <span className="clinical-display">Boundary Errors</span>
            <span className={`clinical-value ${metrics.boundaryViolations > 0 ? 'text-destructive' : 'text-success'}`}>
              {metrics.boundaryViolations}
            </span>
          </div>

          {metrics.switchCostLatencies.length > 0 && (
            <div className="result-metric">
              <span className="clinical-display">Avg Switch Cost</span>
              <span className="clinical-value">
                {(metrics.switchCostLatencies.reduce((a, b) => a + b, 0) / metrics.switchCostLatencies.length).toFixed(0)}ms
              </span>
            </div>
          )}
        </div>

        {/* Failure Reason */}
        {failureReason && (
          <div className="text-center">
            <div className="clinical-display text-destructive">
              {failureReason === 'BOUNDARY_VIOLATION' && 'TERMINATED: BOUNDARY VIOLATION'}
              {failureReason === 'WRONG_ANSWER' && 'TERMINATED: INCORRECT RESPONSE'}
              {failureReason === 'TIMEOUT' && 'TERMINATED: RESPONSE TIMEOUT'}
            </div>
          </div>
        )}

        {/* Continue Button */}
        <button
          onClick={onContinue}
          className="w-full py-4 bg-primary text-primary-foreground font-mono font-semibold tracking-wide rounded-sm hover:opacity-90 transition-opacity glow-primary"
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
}
