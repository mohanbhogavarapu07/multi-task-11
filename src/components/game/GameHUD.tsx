import { useEffect, useState } from 'react';

interface GameHUDProps {
  level: number;
  startTime: number;
  isActive: boolean;
  sessionDuration: number;
}

export function GameHUD({ level, startTime, isActive, sessionDuration }: GameHUDProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, startTime]);

  const remainingTime = Math.max(0, sessionDuration - elapsedTime);
  const progress = 1 - remainingTime / sessionDuration;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Level */}
        <div className="flex items-center gap-4">
          <div className="level-badge">
            LVL {level.toString().padStart(2, '0')}
          </div>
        </div>

        {/* Timer */}
        <div className="flex-1 max-w-xs mx-8">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-100"
              style={{ width: `${(1 - progress) * 100}%` }}
            />
          </div>
        </div>

        {/* Time Display */}
        <div className="text-right">
          <div className="clinical-display">TIME</div>
          <div className="clinical-value text-lg tabular-nums">
            {(elapsedTime / 1000).toFixed(1)}s
          </div>
        </div>
      </div>
    </div>
  );
}
