import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RefreshCw, Award, Scale } from 'lucide-react';
import { GAME_MODES, PLAYERS, GAME_STATUS } from '../utils/constants';

export const ResultModal = ({
  gameStatus,
  winner,
  gameMode,
  onRestart,
  playButtonClick,
}) => {
  if (gameStatus === GAME_STATUS.PLAYING) return null;

  const isWon = gameStatus === GAME_STATUS.WON;
  const isDraw = gameStatus === GAME_STATUS.DRAW;

  let title = '';
  let subtitle = '';
  let isXWinner = winner === PLAYERS.X;

  if (gameMode === GAME_MODES.PVP) {
    if (isDraw) {
      title = "It's a Draw!";
      subtitle = 'Evenly matched gladiators. Neither side gave an inch.';
    } else if (isXWinner) {
      title = 'Player 1 Wins!';
      subtitle = 'Masterful strategy! Player 1 dominated the nexus grid.';
    } else {
      title = 'Player 2 Wins!';
      subtitle = 'Decisive victory! Player 2 outmaneuvered the opponent.';
    }
  } else {
    // PvC
    if (isDraw) {
      title = "It's a Draw!";
      subtitle = 'Impressive! You held your ground against an unbeatable AI.';
    } else if (isXWinner) {
      title = 'You Win!';
      subtitle = 'Incredible feat! You conquered the unbeatable neural AI.';
    } else {
      title = 'Computer Wins!';
      subtitle = 'The unbeatable Minimax AI calculated total victory.';
    }
  }

  const handleRestartClick = () => {
    playButtonClick?.();
    onRestart();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Blurred dark backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-dark-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="result-title"
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="relative z-10 w-full max-w-sm sm:max-w-md p-6 sm:p-8 rounded-3xl glass-panel border border-white/15 shadow-2xl text-center overflow-hidden"
        >
          {/* Ambient background glow inside modal */}
          <div
            className={`absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-[70px] pointer-events-none ${
              isDraw
                ? 'bg-amber-400/20'
                : isXWinner
                ? 'bg-cyan/25'
                : 'bg-purple-600/25'
            }`}
          />

          {/* Trophy or Draw Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 18,
              delay: 0.1,
            }}
            className="flex justify-center mb-4"
          >
            <div
              className={`relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border ${
                isDraw
                  ? 'bg-amber-500/15 border-amber-500/50 text-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.4)]'
                  : isXWinner
                  ? 'bg-cyan/15 border-cyan/50 text-cyan shadow-glow-cyan'
                  : 'bg-purple-500/15 border-purple-500/50 text-purple-300 shadow-glow-purple'
              }`}
            >
              {isDraw ? (
                <Scale className="w-8 h-8 sm:w-10 sm:h-10" />
              ) : (
                <Trophy className="w-8 h-8 sm:w-10 sm:h-10 animate-bounce" />
              )}
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h2
            id="result-title"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className={`text-2xl sm:text-3xl font-gaming font-extrabold tracking-wide mb-2 ${
              isDraw
                ? 'text-amber-300 text-glow-gold'
                : isXWinner
                ? 'text-cyan text-glow-cyan'
                : 'text-purple-300 text-glow-purple'
            }`}
          >
            {title}
          </motion.h2>

          {/* Subtitle / Congratulatory message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-sm text-slate-300 mb-6 px-2 leading-relaxed"
          >
            {subtitle}
          </motion.p>

          {/* Restart Match Button */}
          <motion.button
            onClick={handleRestartClick}
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="w-full py-3 sm:py-3.5 px-6 rounded-xl font-gaming font-bold text-sm sm:text-base tracking-wider flex items-center justify-center gap-2.5 bg-gradient-to-r from-cyan via-cyan-400 to-purple-500 text-black shadow-glow-cyan hover:shadow-glow-cyan-lg transition-all duration-200 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
            RESTART MATCH
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

