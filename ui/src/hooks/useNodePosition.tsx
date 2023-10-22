import { useCallback, useRef } from 'react';
import useWindowDimensions from './useWindowDimensions';

type Position = { x: number; y: number };

const useNodePosition = () => {
  const positionsRef = useRef<Record<number, Position>>({});
  const lastPosRef = useRef<Position>({ x: 0, y: 0 });
  const { height, width } = useWindowDimensions();

  const getPosition = useCallback(
    (id: number, type?: string): Position => {
      if (id === -1) {
        return { x: -1, y: -1 };
      }

      if (positionsRef.current[id]) {
        return positionsRef.current[id];
      }

      const centerX = width / 2 - 300;
      const centerY = height / 2 - 100;
      const isFirst = Object.keys(positionsRef.current).length === 0;
      const isRelated = type === 'relates_to';
      const isLeft = lastPosRef.current.x < centerX;
      const isRight = lastPosRef.current.x >= centerX;

      let newPosition: Position = { x: centerX, y: centerY };

      if (isFirst) {
        newPosition = { x: centerX, y: centerY };
      } else if (isRelated) {
        newPosition = isLeft
          ? { x: centerX + 1000, y: centerY }
          : { x: centerX - 1000, y: centerY };
      } else {
        newPosition = { x: Math.random() * width, y: Math.random() * height };
      }

      // Update the ref directly
      lastPosRef.current = newPosition;
      positionsRef.current[id] = newPosition;

      return newPosition;
    },
    [width, height]
  );

  return getPosition;
};

export default useNodePosition;
