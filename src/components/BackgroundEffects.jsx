import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export const BackgroundEffects = () => {
  // Generate random static particles to prevent re-renders
  const particles = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 12 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.4 + 0.1,
      color: i % 2 === 0 ? 'rgba(0, 243, 255, ' : 'rgba(176, 38, 255, ',
    }));
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
    >
      {/* Deep dark gradient canvas */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(13,27,62,0.6),rgba(3,5,10,1))]" />

      {/* Cyberpunk grid overlay with mask */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 60%, transparent 100%)',
        }}
      />

      {/* Primary Cyan Ambient Orb */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          x: [0, 30, 0],
          y: [0, -20, 0],
          opacity: [0.25, 0.4, 0.25],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-[10%] -left-[10%] w-[55vw] max-w-[600px] h-[55vw] max-h-[600px] rounded-full bg-cyan/20 blur-[120px]"
      />

      {/* Secondary Purple Ambient Orb */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -35, 0],
          y: [0, 25, 0],
          opacity: [0.22, 0.38, 0.22],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute -bottom-[10%] -right-[10%] w-[55vw] max-w-[600px] h-[55vw] max-h-[600px] rounded-full bg-purple-600/20 blur-[130px]"
      />

      {/* Central Subtle Highlight Orb */}
      <motion.div
        animate={{
          opacity: [0.1, 0.18, 0.1],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] max-w-[450px] h-[40vw] max-h-[450px] rounded-full bg-blue-600/10 blur-[100px]"
      />

      {/* Floating Star / Energy Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          animate={{
            y: [`${p.y}%`, `${(p.y - 18 + 100) % 100}%`],
            opacity: [p.opacity * 0.4, p.opacity, p.opacity * 0.4],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: `${p.color}${p.opacity})`,
            boxShadow: `0 0 8px ${p.color}0.8)`,
          }}
        />
      ))}
    </div>
  );
};

