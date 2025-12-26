import { useEffect, useState } from 'react';
import { getLevelConfig } from '@/config/levels';

interface TaskSetupScreenProps {
  level: number;
  onReady: () => void;
}

export function TaskSetupScreen({ level, onReady }: TaskSetupScreenProps) {
  const [countdown, setCountdown] = useState(3);
  const config = getLevelConfig(level);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onReady();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onReady]);

  const getDifficultyLabel = () => {
    if (level <= 3) return 'LOW';
    if (level <= 6) return 'MEDIUM';
    if (level <= 10) return 'HIGH';
    if (level <= 13) return 'EXTREME';
    return 'BRUTAL';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Level */}
        <div>
          <div className="clinical-display mb-2">INITIATING</div>
          <div className="level-badge text-2xl px-8 py-3">
            LEVEL {level.toString().padStart(2, '0')}
          </div>
        </div>

        {/* Difficulty */}
        <div className="space-y-4">
          <div className="flex justify-center gap-8">
            <div>
              <div className="clinical-display">COGNITIVE LOAD</div>
              <div className={`clinical-value text-lg ${
                level <= 3 ? 'text-success' :
                level <= 6 ? 'text-zone-right' :
                level <= 10 ? 'text-primary' :
                'text-destructive'
              }`}>
                {getDifficultyLabel()}
              </div>
            </div>
            <div>
              <div className="clinical-display">RESPONSE WINDOW</div>
              <div className="clinical-value text-lg">
                {(config.statementTimeMs / 1000).toFixed(1)}s
              </div>
            </div>
          </div>
        </div>

        {/* Countdown */}
        <div className="pt-8">
          <div className="clinical-display mb-4">PREPARE</div>
          <div className="text-8xl font-mono font-bold text-primary animate-pulse">
            {countdown}
          </div>
        </div>

        {/* Reminder */}
        <div className="pt-8 space-y-2">
          <div className="flex justify-center gap-12 text-sm">
            <div>
              <span className="text-zone-left">LEFT:</span>
              <span className="text-muted-foreground ml-2">↑ / ↓</span>
            </div>
            <div>
              <span className="text-zone-right">RIGHT:</span>
              <span className="text-muted-foreground ml-2">A / S</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
