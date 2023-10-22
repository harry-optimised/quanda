import React, { FC } from 'react';

interface PNGProps {
  x: number;
  y: number;
  file: string;
  opacity?: number;
}

const PNG: FC<PNGProps> = ({ x, y, file, opacity = 1.0 }) => {
  return (
    <img
      src={`/assets/${file}.png`}
      alt="Your SVG"
      style={{
        position: 'absolute',
        top: `${y}px`,
        left: `${x}px`,
        opacity: opacity
      }}
    />
  );
};

export default PNG;
