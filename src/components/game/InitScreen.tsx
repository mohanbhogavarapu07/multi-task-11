import { PersistedStats } from '@/types/game';

interface InitScreenProps {
  stats: PersistedStats;
  currentLevel: number;
  onStart: () => void;
  onResetStats: () => void;
}

export function InitScreen({ stats, currentLevel, onStart, onResetStats }: InitScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-lg w-full space-y-8">
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-mono font-bold tracking-tight text-foreground">
            MULTI-TASK CHALLENGE
          </h1>
          <p className="clinical-display">
            DIVIDED ATTENTION STRESS TEST
          </p>
        </div>

        {/* Current Level */}
        <div className="flex justify-center">
          <div className="level-badge text-lg px-6 py-2">
            LEVEL {currentLevel.toString().padStart(2, '0')}
          </div>
        </div>

        {/* Stats */}
        {stats.totalSessions > 0 && (
          <div className="bg-card border border-border rounded-sm p-6 space-y-3">
            <div className="clinical-display text-center mb-4">PERFORMANCE HISTORY</div>
            
            <div className="result-metric">
              <span className="clinical-display">Highest Level</span>
              <span className="clinical-value text-primary">{stats.highestLevel}</span>
            </div>
            
            <div className="result-metric">
              <span className="clinical-display">Longest Survival</span>
              <span className="clinical-value">{(stats.longestSurvivalMs / 1000).toFixed(1)}s</span>
            </div>
            
            <div className="result-metric">
              <span className="clinical-display">Total Sessions</span>
              <span className="clinical-value">{stats.totalSessions}</span>
            </div>
            
            <div className="result-metric">
              <span className="clinical-display">Fast Jumps</span>
              <span className="clinical-value text-success">{stats.fastJumpEvents}</span>
            </div>

            {stats.accuracyHistory.length > 0 && (
              <div className="result-metric">
                <span className="clinical-display">Avg Accuracy</span>
                <span className="clinical-value">
                  {(stats.accuracyHistory.reduce((a, b) => a + b, 0) / stats.accuracyHistory.length).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        )}

        {/* Start Button */}
        <button
          onClick={onStart}
          className="w-full py-4 bg-primary text-primary-foreground font-mono font-semibold tracking-wide rounded-sm hover:opacity-90 transition-opacity glow-primary"
        >
          BEGIN SESSION
        </button>

        {/* Reset Stats */}
        {stats.totalSessions > 0 && (
          <button
            onClick={onResetStats}
            className="w-full py-2 text-muted-foreground font-mono text-sm hover:text-foreground transition-colors"
          >
            RESET STATISTICS
          </button>
        )}
      </div>
    </div>
  );
}
