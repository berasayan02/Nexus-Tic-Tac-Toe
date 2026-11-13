import React from 'react';

export const Footer = () => {
  return (
    <footer className="relative w-full max-w-xl mx-auto pt-2 pb-1 sm:pb-1.5 px-3 text-center">
      {/* Subtle glowing top separator line */}
      <div
        aria-hidden="true"
        className="w-36 sm:w-52 h-[1px] mx-auto mb-2 bg-gradient-to-r from-transparent via-cyan/40 to-purple-500/40 shadow-[0_0_8px_rgba(0,243,255,0.3)]"
      />

      {/* Two centered lines */}
      <div className="flex flex-col items-center justify-center gap-0.5 text-slate-400">
        {/* Line 1: Made with ❤️ by Sayan Bera */}
        <p className="text-[11px] sm:text-xs md:text-sm font-medium tracking-wide text-slate-300 flex items-center justify-center gap-1.5 flex-wrap">
          <span>Made with</span>
          <span
            className="animate-heart-beat select-none filter drop-shadow-[0_0_6px_rgba(244,63,94,0.7)]"
            role="img"
            aria-label="love"
          >
            ❤️
          </span>
          <span>by</span>
          <span className="font-gaming font-semibold tracking-wider bg-gradient-to-r from-cyan via-white to-purple-400 bg-clip-text text-transparent hover:drop-shadow-[0_0_8px_rgba(0,243,255,0.7)] transition-all duration-300">
            Sayan Bera
          </span>
        </p>

        {/* Line 2: From TECHNO SB */}
        <p className="text-[9px] sm:text-[10px] md:text-xs font-gaming font-semibold tracking-widest text-slate-400/90 uppercase">
          From{' '}
          <span className="bg-gradient-to-r from-cyan via-cyan-light to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_6px_rgba(0,243,255,0.4)]">
            TECHNO SB
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

