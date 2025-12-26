import { useRef, useEffect, useState } from 'react';

interface VisuospatialZoneProps {
  position: { y: number };
  boundaryTop: number;
  boundaryBottom: number;
  objectSize: number;
  inputDirection: number;
  onHeightChange: (height: number) => void;
}

export function VisuospatialZone({
  position,
  boundaryTop,
  boundaryBottom,
  objectSize,
  inputDirection,
  onHeightChange,
}: VisuospatialZoneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
        onHeightChange(height);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [onHeightChange]);

  const objectX = dimensions.width / 2 - objectSize / 2;

  // Calculate danger proximity for visual feedback
  const distanceToTop = position.y - boundaryTop;
  const distanceToBottom = boundaryBottom - position.y;
  const minDistance = Math.min(distanceToTop, distanceToBottom);
  const dangerThreshold = 30;
  const isDanger = minDistance < dangerThreshold;

  return (
    <div 
      ref={containerRef}
      className="zone-container zone-left h-full relative"
    >
      {/* Zone Label */}
      <div className="absolute top-4 left-4 z-10">
        <div className="clinical-display text-zone-left">VISUOSPATIAL</div>
      </div>

      {/* Controls Hint */}
      <div className="absolute bottom-4 left-4 z-10 flex gap-2">
        <div className={`key-indicator text-xs ${inputDirection === -1 ? 'bg-primary text-primary-foreground' : ''}`}>
          ↑
        </div>
        <div className={`key-indicator text-xs ${inputDirection === 1 ? 'bg-primary text-primary-foreground' : ''}`}>
          ↓
        </div>
      </div>

      {/* Top Boundary */}
      <div 
        className={`boundary-line ${isDanger && distanceToTop < dangerThreshold ? 'boundary-danger' : ''}`}
        style={{ top: boundaryTop }}
      />

      {/* Bottom Boundary */}
      <div 
        className={`boundary-line ${isDanger && distanceToBottom < dangerThreshold ? 'boundary-danger' : ''}`}
        style={{ top: boundaryBottom + objectSize }}
      />

      {/* Safe Zone Indicator */}
      <div 
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          top: boundaryTop,
          height: boundaryBottom - boundaryTop + objectSize,
          background: 'linear-gradient(180deg, hsl(var(--zone-left) / 0.03) 0%, transparent 20%, transparent 80%, hsl(var(--zone-left) / 0.03) 100%)',
        }}
      />

      {/* Game Object */}
      <div
        className="game-object"
        style={{
          left: objectX,
          top: position.y,
          width: objectSize,
          height: objectSize,
        }}
      />
    </div>
  );
}
