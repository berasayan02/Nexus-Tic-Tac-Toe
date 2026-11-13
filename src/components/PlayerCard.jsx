import React from 'react';
import { motion } from 'framer-motion';
import { User, Cpu, Sparkles, Loader2 } from 'lucide-react';
import { PLAYERS, GAME_MODES } from '../utils/constants';

export const PlayerCard = ({
  playerSymbol,
  playerConfig,
  isActive,
  isThinking,
  gameMode,
}) => {
  const isPlayerX = playerSymbol === PLAYERS.X;
  const isComputer = gameMode === GAME_MODES.PVC && !isPlayerX;

  const glowBorderClass = isPlayerX
    ? 'border-cyan/90 shadow-glow-cyan bg-cyan/10'
    : 'border-purple-500/90 shadow-glow-purple bg-purple-500/10';

  const inactiveBorderClass =
    'border-white/10 bg-slate-900/50 opacity-75 hover:opacity-90';

  return (
    <motion.div
      animate={{
        scale: isActive ? 1.02 : 0.98,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`relative overflow-hidden flex items-center justify-between p-2.5 sm:p-3.5 rounded-2xl glass-panel transition-all duration-300 border ${
        isActive ? glowBorderClass : inactiveBorderClass
      }`}
    >
      {/* Active pulse glow line on top */}
      {isActive && (
        <motion.div
          layoutId={`active-line-${playerSymbol}`}
          className={`absolute top-0 left-0 right-0 h-1 ${
            isPlayerX
              ? 'bg-gradient-to-r from-transparent via-cyan to-transparent'
              : 'bg-gradient-to-r from-transparent via-purple-400 to-transparent'
          }`}
        />
      )}

      {/* Left side: Avatar + Name + Status */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <div
          className={`relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl transition-all ${
            isPlayerX
              ? 'bg-cyan/20 text-cyan border border-cyan/40'
              : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
          }`}
        >
          {isComputer ? (
            <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
          )}

          {isActive && (
            <span
              className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full ${
                isPlayerX ? 'bg-cyan animate-ping' : 'bg-purple-400 animate-ping'
              }`}
            />
          )}
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs sm:text-sm font-gaming font-bold tracking-wider text-slate-100 truncate">
              {playerConfig.name}
            </span>
          </div>

          {/* Dynamic turn/status message */}
          <div className="flex items-center gap-1 text-[10px] sm:text-xs">
            {isThinking ? (
              <span className="text-purple-300 font-semibold flex items-center gap-1 animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin text-purple-400" />
                THINKING...
              </span>
            ) : isActive ? (
              <span
                className={`font-semibold flex items-center gap-1 ${
                  isPlayerX ? 'text-cyan text-glow-cyan' : 'text-purple-300 text-glow-purple'
                }`}
              >
                <Sparkles className="w-2.5 h-2.5" />
                ACTIVE TURN
              </span>
            ) : (
              <span className="text-slate-400">WAITING</span>
            )}
          </div>
        </div>
      </div>

      {/* Right side: Large Neon Symbol */}
      <div className="flex items-center justify-center pl-2">
        <span
          className={`font-gaming font-black text-xl sm:text-3xl ${
            isPlayerX
              ? 'text-cyan text-glow-cyan drop-shadow-[0_0_12px_rgba(0,243,255,0.8)]'
              : 'text-purple-400 text-glow-purple drop-shadow-[0_0_12px_rgba(176,38,255,0.8)]'
          }`}
        >
          {playerConfig.symbol}
        </span>
      </div>
    </motion.div>
  );
};

