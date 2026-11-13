import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Zap } from 'lucide-react';
import { PLAYERS, GAME_MODES, PLAYER_CONFIG } from '../utils/constants';

export const TurnIndicator = ({
  currentPlayer,
  gameMode,
  isComputerThinking,
}) => {
  const currentConfig = PLAYER_CONFIG[gameMode][currentPlayer];
  const isX = currentPlayer === PLAYERS.X;

  return (
    <div className="w-full flex justify-center mb-2 sm:mb-3">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${gameMode}-${currentPlayer}-${isComputerThinking}`}
          initial={{ opacity: 0, y: -8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full glass-panel border transition-all ${
            isComputerThinking
              ? 'border-purple-500/70 bg-purple-500/15 shadow-glow-purple/40 text-purple-200'
              : isX
              ? 'border-cyan/70 bg-cyan/15 shadow-glow-cyan/40 text-cyan'
              : 'border-purple-500/70 bg-purple-500/15 shadow-glow-purple/40 text-purple-200'
          }`}
        >
          {isComputerThinking ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-300" />
              <span className="text-[11px] sm:text-xs font-gaming font-semibold tracking-wider">
                AI NEURAL SYSTEM COMPUTING...
              </span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 animate-pulse" />
              <span className="text-[11px] sm:text-xs font-gaming font-semibold tracking-wider">
                {gameMode === GAME_MODES.PVC && isX
                  ? 'YOUR TURN (X)'
                  : `${currentConfig.name}'S TURN (${currentConfig.symbol})`}
              </span>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

