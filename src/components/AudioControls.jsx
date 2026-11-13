import React, { useState } from 'react';
import { Volume2, VolumeX, Music, MicOff, Sliders } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AudioControls = ({
  musicEnabled,
  setMusicEnabled,
  soundEnabled,
  setSoundEnabled,
  musicVolume,
  setMusicVolume,
  playButtonClick,
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const toggleMusic = () => {
    playButtonClick?.();
    setMusicEnabled((prev) => !prev);
  };

  const toggleSound = () => {
    playButtonClick?.();
    setSoundEnabled((prev) => !prev);
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {/* Sound Effects Toggle */}
      <button
        onClick={toggleSound}
        type="button"
        className={`relative p-2 sm:p-2.5 rounded-xl border transition-all duration-200 ${
          soundEnabled
            ? 'bg-cyan/10 border-cyan/40 text-cyan shadow-glow-cyan/30 hover:bg-cyan/20'
            : 'bg-slate-900/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:border-slate-600'
        }`}
        title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
        aria-label={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
      >
        {soundEnabled ? (
          <Volume2 className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
        ) : (
          <VolumeX className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
        )}
      </button>

      {/* Music Toggle & Volume Control Container */}
      <div className="relative flex items-center">
        <button
          onClick={toggleMusic}
          type="button"
          className={`relative p-2 sm:p-2.5 rounded-xl border transition-all duration-200 ${
            musicEnabled
              ? 'bg-purple-500/10 border-purple-500/40 text-purple-300 shadow-glow-purple/30 hover:bg-purple-500/20'
              : 'bg-slate-900/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:border-slate-600'
          }`}
          title={musicEnabled ? 'Pause Ambient Music' : 'Play Ambient Music'}
          aria-label={musicEnabled ? 'Pause Ambient Music' : 'Play Ambient Music'}
        >
          <Music className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
        </button>

        {/* Volume popover trigger button */}
        <button
          onClick={() => {
            playButtonClick?.();
            setShowVolumeSlider((prev) => !prev);
          }}
          type="button"
          className={`ml-1 p-2 sm:p-2.5 rounded-xl border transition-all duration-200 ${
            showVolumeSlider
              ? 'bg-slate-800 border-cyan/40 text-cyan'
              : 'bg-slate-900/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
          }`}
          title="Adjust Volume"
          aria-label="Adjust Volume"
        >
          <Sliders className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
        </button>

        {/* Volume slider popover */}
        <AnimatePresence>
          {showVolumeSlider && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-12 z-50 p-3 rounded-2xl glass-panel border border-slate-700/80 shadow-2xl flex flex-col gap-2 min-w-[170px]"
            >
              <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-purple-400" />
                  Volume
                </span>
                <span className="text-cyan font-mono">{Math.round(musicVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={musicVolume}
                onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                className="slider-custom w-full cursor-pointer accent-cyan"
                aria-label="Music volume slider"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

