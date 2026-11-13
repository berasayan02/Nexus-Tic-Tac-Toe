import React from 'react';
import { motion } from 'framer-motion';
import { PLAYERS } from '../utils/constants';

export const WinningLine = ({ combination, winner }) => {
  if (!combination || !winner) return null;

  const isX = winner === PLAYERS.X;
  const strokeColor = isX ? '#00f3ff' : '#b026ff';
  const glowColor = isX ? 'rgba(0, 243, 255, 0.9)' : 'rgba(176, 38, 255, 0.9)';

  // Calculate coordinates in percentage (0 to 100)
  let x1 = 0, y1 = 0, x2 = 0, y2 = 0;

  if (combination.type === 'row') {
    const yOffsets = [16.66, 50, 83.33];
    const y = yOffsets[combination.row];
    x1 = 6;
    x2 = 94;
    y1 = y;
    y2 = y;
  } else if (combination.type === 'col') {
    const xOffsets = [16.66, 50, 83.33];
    const x = xOffsets[combination.col];
    x1 = x;
    x2 = x;
    y1 = 6;
    y2 = 94;
  } else if (combination.type === 'diag') {
    if (combination.direction === 'main') {
      x1 = 8;
      y1 = 8;
      x2 = 92;
      y2 = 92;
    } else {
      x1 = 92;
      y1 = 8;
      x2 = 8;
      y2 = 92;
    }
  }

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center p-2 sm:p-3"
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible"
        style={{
          filter: `drop-shadow(0 0 8px ${glowColor}) drop-shadow(0 0 16px ${glowColor})`,
        }}
      >
        {/* Glow halo behind */}
        <motion.line
          x1={`${x1}%`}
          y1={`${y1}%`}
          x2={`${x2}%`}
          y2={`${y2}%`}
          stroke={strokeColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeOpacity="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        />

        {/* Sharp core laser beam */}
        <motion.line
          x1={`${x1}%`}
          y1={`${y1}%`}
          x2={`${x2}%`}
          y2={`${y2}%`}
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </svg>
    </div>
  );
};

