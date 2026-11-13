import React from 'react';
import { motion } from 'framer-motion';
import { PLAYERS } from '../utils/constants';

export const GameCell = ({
  index,
  value,
  onClick,
  isWinningCell,
  disabled,
  turnSymbol,
}) => {
  const isOccupied = value !== null;
  const isX = value === PLAYERS.X;
  const isO = value === PLAYERS.O;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled || isOccupied}
      whileHover={
        !disabled && !isOccupied
          ? { scale: 1.03, backgroundColor: 'rgba(255, 255, 255, 0.07)' }
          : {}
      }
      whileTap={!disabled && !isOccupied ? { scale: 0.96 } : {}}
      className={`relative aspect-square rounded-2xl flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan/60 ${
        isWinningCell
          ? isX
            ? 'bg-cyan/25 border-2 border-cyan shadow-glow-cyan-lg'
            : 'bg-purple-600/25 border-2 border-purple-500 shadow-glow-purple-lg'
          : isOccupied
          ? 'bg-slate-900/60 border border-white/10'
          : disabled
          ? 'bg-slate-900/40 border border-white/5 cursor-not-allowed opacity-80'
          : 'bg-slate-900/50 border border-white/10 hover:border-cyan/40 hover:shadow-glow-cyan/20 cursor-pointer'
      }`}
      aria-label={`Cell ${index + 1}${value ? `, occupied by ${value}` : ', empty'}`}
    >
      {/* Subtle glass reflection gradient inside each cell */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.07] via-transparent to-transparent pointer-events-none" />

      {/* Render X */}
      {isX && (
        <motion.div
          initial={{ scale: 0, rotate: -45, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 420,
            damping: 22,
          }}
          className="relative flex items-center justify-center w-full h-full p-3 sm:p-5"
        >
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-[0_0_15px_rgba(0,243,255,0.85)]"
          >
            <motion.path
              d="M 22 22 L 78 78"
              stroke="#00f3ff"
              strokeWidth="13"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            />
            <motion.path
              d="M 78 22 L 22 78"
              stroke="#00f3ff"
              strokeWidth="13"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.28, ease: 'easeOut', delay: 0.08 }}
            />
          </svg>
        </motion.div>
      )}

      {/* Render O */}
      {isO && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 420,
            damping: 22,
          }}
          className="relative flex items-center justify-center w-full h-full p-3 sm:p-5"
        >
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-[0_0_15px_rgba(176,38,255,0.85)]"
          >
            <motion.circle
              cx="50"
              cy="50"
              r="30"
              stroke="#b026ff"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            />
          </svg>
        </motion.div>
      )}

      {/* Subtle Ghost preview on hover for desktop empty cell */}
      {!isOccupied && !disabled && (
        <div className="hidden sm:block absolute inset-0 rounded-2xl opacity-0 hover:opacity-15 transition-opacity duration-200 pointer-events-none flex items-center justify-center">
          <span
            className={`font-gaming text-3xl font-extrabold ${
              turnSymbol === PLAYERS.X ? 'text-cyan' : 'text-purple-400'
            }`}
          >
            {turnSymbol}
          </span>
        </div>
      )}
    </motion.button>
  );
};

