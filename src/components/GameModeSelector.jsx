import React from 'react';
import { motion } from 'framer-motion';
import { Users, Bot } from 'lucide-react';
import { GAME_MODES } from '../utils/constants';

export const GameModeSelector = ({
  currentGameMode,
  onSelectMode,
  playButtonClick,
}) => {
  const modes = [
    {
      id: GAME_MODES.PVP,
      name: 'PLAYER VS PLAYER',
      description: 'Local 2 Players',
      icon: Users,
      accentColor: 'cyan',
    },
    {
      id: GAME_MODES.PVC,
      name: 'PLAYER VS COMPUTER',
      description: 'Unbeatable AI (Minimax)',
      icon: Bot,
      accentColor: 'purple',
    },
  ];

  return (
    <div className="w-full max-w-xl mx-auto mb-2 sm:mb-4 px-1">
      <div className="grid grid-cols-2 gap-2 sm:gap-3 p-1 sm:p-1.5 rounded-2xl glass-panel border border-white/10">
        {modes.map((mode) => {
          const isActive = currentGameMode === mode.id;
          const Icon = mode.icon;

          return (
            <button
              key={mode.id}
              onClick={() => {
                playButtonClick?.();
                onSelectMode(mode.id);
              }}
              type="button"
              className={`relative overflow-hidden group flex items-center justify-center gap-2 sm:gap-3 py-2 sm:py-2.5 px-2.5 sm:px-4 rounded-xl text-left transition-all duration-300 ${
                isActive
                  ? mode.accentColor === 'cyan'
                    ? 'bg-cyan/15 text-cyan border border-cyan/60 shadow-glow-cyan/40'
                    : 'bg-purple-500/15 text-purple-300 border border-purple-500/60 shadow-glow-purple/40'
                  : 'bg-slate-900/40 text-slate-400 border border-white/5 hover:border-white/15 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-mode-indicator"
                  className={`absolute inset-0 rounded-xl pointer-events-none ${
                    mode.accentColor === 'cyan'
                      ? 'bg-gradient-to-r from-cyan/20 to-transparent'
                      : 'bg-gradient-to-r from-purple-500/20 to-transparent'
                  }`}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}

              <div
                className={`p-1.5 sm:p-2 rounded-lg transition-transform duration-200 group-hover:scale-110 ${
                  isActive
                    ? mode.accentColor === 'cyan'
                      ? 'bg-cyan/20 text-cyan'
                      : 'bg-purple-500/20 text-purple-300'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>

              <div className="flex flex-col min-w-0">
                <span className="text-[11px] sm:text-xs md:text-sm font-gaming font-bold tracking-wider truncate">
                  {mode.name}
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 truncate hidden xs:inline">
                  {mode.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

