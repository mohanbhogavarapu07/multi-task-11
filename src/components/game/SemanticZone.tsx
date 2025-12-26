import { Statement } from '@/types/game';

interface SemanticZoneProps {
  statement: Statement | null;
  timeRemaining: number;
  correctCount: number;
  totalCount: number;
}

export function SemanticZone({
  statement,
  timeRemaining,
  correctCount,
  totalCount,
}: SemanticZoneProps) {
  const isUrgent = timeRemaining < 0.3;

  return (
    <div className="zone-container zone-right h-full relative flex flex-col">
      {/* Zone Label */}
      <div className="absolute top-4 right-4 z-10">
        <div className="clinical-display text-zone-right">SEMANTIC</div>
      </div>

      {/* Score */}
      <div className="absolute top-4 left-4 z-10">
        <div className="clinical-display">CORRECT</div>
        <div className="clinical-value text-lg">
          {correctCount} / {totalCount}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {statement ? (
          <div className="w-full max-w-md space-y-6">
            {/* Timer Bar */}
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className={`timer-bar ${isUrgent ? 'timer-bar-urgent' : ''}`}
                style={{ width: `${timeRemaining * 100}%` }}
              />
            </div>

            {/* Statement */}
            <div className="statement-card">
              <p className="text-xl font-medium text-foreground leading-relaxed">
                {statement.text}
              </p>
            </div>

            {/* Answer Options */}
            <div className="flex justify-center gap-8">
              <div className="text-center space-y-2">
                <div className="key-indicator key-indicator-true text-lg px-6 py-3">
                  A
                </div>
                <div className="text-xs text-success font-mono">TRUE</div>
              </div>
              <div className="text-center space-y-2">
                <div className="key-indicator key-indicator-false text-lg px-6 py-3">
                  S
                </div>
                <div className="text-xs text-destructive font-mono">FALSE</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="clinical-display">LOADING...</div>
        )}
      </div>
    </div>
  );
}
