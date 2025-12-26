import { FailureReason } from '@/types/game';
import { useEffect, useState } from 'react';

interface FailureScreenProps {
  reason: FailureReason;
}

export function FailureScreen({ reason }: FailureScreenProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Small delay for dramatic effect
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getReasonText = () => {
    switch (reason) {
      case 'BOUNDARY_VIOLATION':
        return 'BOUNDARY VIOLATION';
      case 'WRONG_ANSWER':
        return 'INCORRECT RESPONSE';
      case 'TIMEOUT':
        return 'RESPONSE TIMEOUT';
      default:
        return 'SESSION TERMINATED';
    }
  };

  return (
    <div className="failure-overlay">
      <div className={`text-center space-y-4 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-6xl font-mono font-bold text-destructive">
          FAIL
        </div>
        <div className="clinical-display text-destructive">
          {getReasonText()}
        </div>
      </div>
    </div>
  );
}
