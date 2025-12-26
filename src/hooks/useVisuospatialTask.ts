import { useState, useEffect, useCallback, useRef } from 'react';
import { getLevelConfig, BOUNDARY_PADDING } from '@/config/levels';

interface ObjectPosition {
  y: number;
  velocity: number;
}

export function useVisuospatialTask(
  level: number,
  isActive: boolean,
  zoneHeight: number,
  onBoundaryViolation: () => void
) {
  const [position, setPosition] = useState<ObjectPosition>({ y: 0, velocity: 0 });
  const [inputDirection, setInputDirection] = useState<number>(0); // -1 up, 0 none, 1 down
  const frameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const config = getLevelConfig(level);

  const objectSize = 24;
  const boundaryTop = BOUNDARY_PADDING;
  const boundaryBottom = zoneHeight - BOUNDARY_PADDING - objectSize;

  // Initialize position to center
  useEffect(() => {
    if (zoneHeight > 0) {
      setPosition({ y: zoneHeight / 2 - objectSize / 2, velocity: 0 });
    }
  }, [zoneHeight]);

  // Handle keyboard input
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        setInputDirection(-1);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        setInputDirection(1);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        setInputDirection(prev => prev === -1 ? 0 : prev);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        setInputDirection(prev => prev === 1 ? 0 : prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isActive]);

  // Game loop
  useEffect(() => {
    if (!isActive || zoneHeight === 0) return;

    const gameLoop = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }

      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Normalize to ~60fps
      const frameMultiplier = deltaTime / 16.67;

      setPosition(prev => {
        // Apply random drift
        const drift = (Math.random() - 0.5) * config.objectDrift * frameMultiplier;
        
        // Apply user input (counteracts drift)
        const userForce = inputDirection * config.objectSpeed * 2 * frameMultiplier;
        
        // Calculate new velocity with some friction
        let newVelocity = prev.velocity * 0.95 + drift + userForce;
        
        // Add base drift towards random direction
        newVelocity += (Math.random() > 0.5 ? 1 : -1) * config.objectSpeed * 0.3 * frameMultiplier;
        
        // Clamp velocity
        newVelocity = Math.max(-config.objectSpeed * 3, Math.min(config.objectSpeed * 3, newVelocity));
        
        // Calculate new position
        let newY = prev.y + newVelocity;

        // Check boundaries
        if (newY < boundaryTop || newY > boundaryBottom) {
          onBoundaryViolation();
          return prev; // Don't update if boundary violated
        }

        return { y: newY, velocity: newVelocity };
      });

      frameRef.current = requestAnimationFrame(gameLoop);
    };

    frameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isActive, zoneHeight, config, inputDirection, boundaryTop, boundaryBottom, onBoundaryViolation]);

  const reset = useCallback(() => {
    setPosition({ y: zoneHeight / 2 - objectSize / 2, velocity: 0 });
    setInputDirection(0);
    lastTimeRef.current = 0;
  }, [zoneHeight]);

  return {
    position,
    boundaryTop,
    boundaryBottom,
    objectSize,
    inputDirection,
    reset,
  };
}
