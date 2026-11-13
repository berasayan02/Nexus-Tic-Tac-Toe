import React from 'react';
import { motion } from 'framer-motion';
import { AudioControls } from './AudioControls';
import { Sparkles, Gamepad2 } from 'lucide-react';

export const Header = ({
  musicEnabled,
  setMusicEnabled,
  soundEnabled,
  setSoundEnabled,
  musicVolume,
  setMusicVolume,
  playButtonClick,
}) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-4xl mx-auto flex items-center justify-between py-2 sm:py-3 px-3 sm:px-6 rounded-2xl glass-panel mb-2 sm:mb-4 border border-white/10"
    >
      {/* Branding / Logo */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        <div className="relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-cyan/20 via-slate-900 to-purple-600/20 border border-cyan/40 shadow-glow-cyan/40">
          <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 text-cyan" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-1 -right-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          </motion.div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <h1 className="text-base sm:text-xl md:text-2xl font-gaming font-extrabold tracking-wider bg-gradient-to-r from-cyan via-white to-purple-400 bg-clip-text text-transparent">
              TIC TAC TOE
            </h1>
            <span className="text-[10px] sm:text-xs font-mono font-semibold px-1.5 py-0.5 rounded bg-cyan/15 text-cyan border border-cyan/30">
              NEXUS
            </span>
          </div>
          <p className="text-[10px] sm:text-xs font-medium text-slate-400 tracking-wide">
            The Ultimate XO Experience
          </p>
        </div>
      </div>

      {/* Audio Controls */}
      <AudioControls
        musicEnabled={musicEnabled}
        setMusicEnabled={setMusicEnabled}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        musicVolume={musicVolume}
        setMusicVolume={setMusicVolume}
        playButtonClick={playButtonClick}
      />
    </motion.header>
  );
};

