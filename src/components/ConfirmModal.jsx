import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Check } from 'lucide-react';

export const ConfirmModal = ({
  isOpen,
  onConfirm,
  onCancel,
  playButtonClick,
}) => {
  if (!isOpen) return null;

  const handleCancel = () => {
    playButtonClick?.();
    onCancel();
  };

  const handleConfirm = () => {
    playButtonClick?.();
    onConfirm();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCancel}
          className="absolute inset-0 bg-dark-950/80 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
          aria-describedby="confirm-modal-desc"
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="relative z-10 w-full max-w-sm sm:max-w-md p-6 sm:p-7 rounded-3xl glass-panel border border-amber-500/30 shadow-2xl overflow-hidden text-center"
        >
          {/* Subtle amber ambient glow */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-amber-500/15 blur-[60px] pointer-events-none" />

          {/* Warning Icon */}
          <div className="flex justify-center mb-3">
            <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.3)]">
              <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
          </div>

          {/* Title */}
          <h3
            id="confirm-modal-title"
            className="text-lg sm:text-xl font-gaming font-bold text-slate-100 tracking-wide mb-2"
          >
            RESET CURRENT MATCH?
          </h3>

          {/* Exact required warning message */}
          <p
            id="confirm-modal-desc"
            className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 px-1"
          >
            Switching game mode will reset the current match. All existing X and O
            moves will be removed. Do you want to continue?
          </p>

          {/* Action Buttons: Cancel and OK */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <button
              onClick={handleCancel}
              type="button"
              className="py-2.5 sm:py-3 px-4 rounded-xl font-gaming font-semibold text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer"
            >
              <X className="w-4 h-4 text-slate-400" />
              CANCEL
            </button>

            <button
              onClick={handleConfirm}
              type="button"
              className="py-2.5 sm:py-3 px-4 rounded-xl font-gaming font-bold text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-all duration-200 cursor-pointer"
            >
              <Check className="w-4 h-4 text-black stroke-[3]" />
              OK
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

