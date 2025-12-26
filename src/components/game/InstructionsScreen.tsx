import { useEffect, useState } from 'react';

interface InstructionsScreenProps {
  onContinue: () => void;
}

export function InstructionsScreen({ onContinue }: InstructionsScreenProps) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onContinue();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onContinue]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="clinical-display mb-2">ATTENTION</div>
          <h2 className="text-2xl font-mono font-bold text-foreground">
            DUAL-TASK PROTOCOL
          </h2>
        </div>

        {/* Instructions Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Zone */}
          <div className="bg-card border border-zone-left/30 rounded-sm p-6 space-y-4">
            <div className="text-zone-left font-mono font-bold text-lg">
              LEFT ZONE
            </div>
            <div className="clinical-display">VISUOSPATIAL CONTROL</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Keep the object within the boundary lines. 
              The object will drift randomly.
            </p>
            <div className="flex gap-2 justify-center pt-2">
              <div className="key-indicator">↑</div>
              <div className="key-indicator">↓</div>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              or W / S keys
            </p>
          </div>

          {/* Right Zone */}
          <div className="bg-card border border-zone-right/30 rounded-sm p-6 space-y-4">
            <div className="text-zone-right font-mono font-bold text-lg">
              RIGHT ZONE
            </div>
            <div className="clinical-display">SEMANTIC DECISION</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Evaluate statements as TRUE or FALSE.
              Respond before time expires.
            </p>
            <div className="flex gap-4 justify-center pt-2">
              <div className="flex items-center gap-2">
                <div className="key-indicator key-indicator-true">A</div>
                <span className="text-xs text-success">TRUE</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="key-indicator key-indicator-false">S</div>
                <span className="text-xs text-destructive">FALSE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-destructive/10 border border-destructive/30 rounded-sm p-4 text-center">
          <p className="text-sm text-destructive font-mono">
            FAILURE IN EITHER ZONE TERMINATES SESSION IMMEDIATELY
          </p>
        </div>

        {/* Countdown */}
        <div className="text-center space-y-2">
          <div className="clinical-display">COMMENCING IN</div>
          <div className="text-5xl font-mono font-bold text-primary">
            {countdown}
          </div>
        </div>
      </div>
    </div>
  );
}
