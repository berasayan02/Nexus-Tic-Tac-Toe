import { useState, useEffect, useRef, useCallback } from 'react';
import { AUDIO_STORAGE_KEYS } from '../utils/constants';

export const useAudio = () => {
  // State from localStorage or defaults
  const [musicEnabled, setMusicEnabled] = useState(() => {
    const saved = localStorage.getItem(AUDIO_STORAGE_KEYS.MUSIC_ENABLED);
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem(AUDIO_STORAGE_KEYS.SOUND_ENABLED);
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [musicVolume, setMusicVolume] = useState(() => {
    const saved = localStorage.getItem(AUDIO_STORAGE_KEYS.MUSIC_VOLUME);
    return saved !== null ? parseFloat(saved) : 0.3;
  });

  const audioCtxRef = useRef(null);
  const musicMasterGainRef = useRef(null);
  const isMusicPlayingRef = useRef(false);
  const musicIntervalRef = useRef(null);
  const hasInteractedRef = useRef(false);

  // Initialize AudioContext lazily on user interaction
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
        const gainNode = audioCtxRef.current.createGain();
        gainNode.gain.setValueAtTime(musicVolume, audioCtxRef.current.currentTime);
        gainNode.connect(audioCtxRef.current.destination);
        musicMasterGainRef.current = gainNode;
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, [musicVolume]);

  // Persist preferences
  useEffect(() => {
    localStorage.setItem(AUDIO_STORAGE_KEYS.MUSIC_ENABLED, JSON.stringify(musicEnabled));
  }, [musicEnabled]);

  useEffect(() => {
    localStorage.setItem(AUDIO_STORAGE_KEYS.SOUND_ENABLED, JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem(AUDIO_STORAGE_KEYS.MUSIC_VOLUME, musicVolume.toString());
    if (musicMasterGainRef.current && audioCtxRef.current) {
      musicMasterGainRef.current.gain.setTargetAtTime(
        musicEnabled ? musicVolume * 0.4 : 0,
        audioCtxRef.current.currentTime,
        0.05
      );
    }
  }, [musicVolume, musicEnabled]);

  // Ambient procedural music generator
  const startBackgroundMusic = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx || isMusicPlayingRef.current) return;

    isMusicPlayingRef.current = true;

    // Chords: Em7, Cmaj7, G, Dsus2 (frequencies in Hz)
    const chords = [
      [164.81, 196.00, 246.94, 293.66], // E3, G3, B3, D4
      [130.81, 164.81, 196.00, 246.94], // C3, E3, G3, B3
      [196.00, 246.94, 293.66, 392.00], // G3, B3, D4, G4
      [146.83, 220.00, 293.66, 440.00], // D3, A3, D4, A4
    ];

    let chordIdx = 0;

    const playChord = () => {
      if (!isMusicPlayingRef.current || !audioCtxRef.current) return;
      const currentCtx = audioCtxRef.current;
      const now = currentCtx.currentTime;
      const currentChord = chords[chordIdx];
      chordIdx = (chordIdx + 1) % chords.length;

      const duration = 5.0; // 5 seconds per chord

      currentChord.forEach((freq, idx) => {
        const osc = currentCtx.createOscillator();
        const gain = currentCtx.createGain();
        const filter = currentCtx.createBiquadFilter();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        // Gentle filter sweep
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, now);
        filter.frequency.exponentialRampToValueAtTime(750, now + duration * 0.5);
        filter.frequency.exponentialRampToValueAtTime(450, now + duration);

        // Smooth volume envelope
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.06, now + 1.2);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(musicMasterGainRef.current);

        osc.start(now);
        osc.stop(now + duration + 0.1);
      });

      // Subtle celestial twinkle
      if (Math.random() > 0.3) {
        const twinkleFreq = currentChord[Math.floor(Math.random() * currentChord.length)] * 4;
        const twinkleOsc = currentCtx.createOscillator();
        const twinkleGain = currentCtx.createGain();
        twinkleOsc.type = 'sine';
        twinkleOsc.frequency.setValueAtTime(twinkleFreq, now + 1.5);
        twinkleGain.gain.setValueAtTime(0.0001, now + 1.5);
        twinkleGain.gain.exponentialRampToValueAtTime(0.02, now + 1.7);
        twinkleGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);
        twinkleOsc.connect(twinkleGain);
        twinkleGain.connect(musicMasterGainRef.current);
        twinkleOsc.start(now + 1.5);
        twinkleOsc.stop(now + 3.1);
      }
    };

    playChord();
    musicIntervalRef.current = setInterval(playChord, 4600);
  }, [getAudioContext]);

  const stopBackgroundMusic = useCallback(() => {
    isMusicPlayingRef.current = false;
    if (musicIntervalRef.current) {
      clearInterval(musicIntervalRef.current);
      musicIntervalRef.current = null;
    }
  }, []);

  // Control background music playback according to state
  useEffect(() => {
    if (musicEnabled && hasInteractedRef.current) {
      startBackgroundMusic();
    } else {
      stopBackgroundMusic();
    }
    return () => stopBackgroundMusic();
  }, [musicEnabled, startBackgroundMusic, stopBackgroundMusic]);

  // First user interaction unlock
  const handleUserInteraction = useCallback(() => {
    if (!hasInteractedRef.current) {
      hasInteractedRef.current = true;
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume();
      }
      if (musicEnabled) {
        startBackgroundMusic();
      }
    }
  }, [getAudioContext, musicEnabled, startBackgroundMusic]);

  // SOUND EFFECTS GENERATORS
  const playSoundEffect = useCallback((generator) => {
    handleUserInteraction();
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      generator(ctx, ctx.currentTime);
    } catch {
      // Graceful fallback
    }
  }, [soundEnabled, getAudioContext, handleUserInteraction]);

  // 1. Button click
  const playButtonClick = useCallback(() => {
    playSoundEffect((ctx, now) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    });
  }, [playSoundEffect]);

  // 2. X placement (Electric Cyan laser/chime)
  const playXMove = useCallback(() => {
    playSoundEffect((ctx, now) => {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

      osc2.frequency.setValueAtTime(1174.66, now); // D6
      osc2.frequency.exponentialRampToValueAtTime(1760, now + 0.12);

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.Q.setValueAtTime(3, now);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.18);
      osc2.stop(now + 0.18);
    });
  }, [playSoundEffect]);

  // 3. O placement (Neon Purple warm resonant harmonic ping)
  const playOMove = useCallback(() => {
    playSoundEffect((ctx, now) => {
      const osc = ctx.createOscillator();
      const oscSub = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      oscSub.type = 'sine';

      osc.frequency.setValueAtTime(392.00, now); // G4
      osc.frequency.exponentialRampToValueAtTime(261.63, now + 0.18); // C4

      oscSub.frequency.setValueAtTime(130.81, now); // C3
      oscSub.frequency.exponentialRampToValueAtTime(98.00, now + 0.18); // G2

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(filter);
      oscSub.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      oscSub.start(now);
      osc.stop(now + 0.22);
      oscSub.stop(now + 0.22);
    });
  }, [playSoundEffect]);

  // 4. Turn change
  const playTurnChange = useCallback(() => {
    playSoundEffect((ctx, now) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.08);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    });
  }, [playSoundEffect]);

  // 5. Winning (Cyberpunk fanfare)
  const playWin = useCallback(() => {
    playSoundEffect((ctx, now) => {
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
      notes.forEach((freq, idx) => {
        const noteTime = now + idx * 0.1;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.18, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(noteTime);
        osc.stop(noteTime + 0.65);
      });
    });
  }, [playSoundEffect]);

  // 6. Draw (Mysterious cyber chord)
  const playDraw = useCallback(() => {
    playSoundEffect((ctx, now) => {
      const freqs = [220, 277.18, 329.63]; // A minor chord
      freqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.9, now + 0.8);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.85);
      });
    });
  }, [playSoundEffect]);

  // 7. Restart
  const playRestart = useCallback(() => {
    playSoundEffect((ctx, now) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.25);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);
    });
  }, [playSoundEffect]);

  // 8. Mode switching
  const playModeSwitch = useCallback(() => {
    playSoundEffect((ctx, now) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(500, now + 0.2);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.21);
    });
  }, [playSoundEffect]);

  // 9. Modal open / close
  const playModalOpen = useCallback(() => {
    playSoundEffect((ctx, now) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    });
  }, [playSoundEffect]);

  const playModalClose = useCallback(() => {
    playSoundEffect((ctx, now) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(550, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.12);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    });
  }, [playSoundEffect]);

  return {
    musicEnabled,
    setMusicEnabled,
    soundEnabled,
    setSoundEnabled,
    musicVolume,
    setMusicVolume,
    handleUserInteraction,
    playButtonClick,
    playXMove,
    playOMove,
    playTurnChange,
    playWin,
    playDraw,
    playRestart,
    playModeSwitch,
    playModalOpen,
    playModalClose,
  };
};

