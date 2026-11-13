export const GAME_MODES = {
  PVP: 'pvp',
  PVC: 'pvc',
};

export const PLAYERS = {
  X: 'X',
  O: 'O',
};

export const GAME_STATUS = {
  PLAYING: 'playing',
  WON: 'won',
  DRAW: 'draw',
};

export const WINNING_COMBINATIONS = [
  // Horizontal Rows
  { indices: [0, 1, 2], type: 'row', row: 0, label: 'Top Row' },
  { indices: [3, 4, 5], type: 'row', row: 1, label: 'Middle Row' },
  { indices: [6, 7, 8], type: 'row', row: 2, label: 'Bottom Row' },

  // Vertical Columns
  { indices: [0, 3, 6], type: 'col', col: 0, label: 'Left Column' },
  { indices: [1, 4, 7], type: 'col', col: 1, label: 'Middle Column' },
  { indices: [2, 5, 8], type: 'col', col: 2, label: 'Right Column' },

  // Diagonals
  { indices: [0, 4, 8], type: 'diag', direction: 'main', label: 'Main Diagonal' },
  { indices: [2, 4, 6], type: 'diag', direction: 'anti', label: 'Anti Diagonal' },
];

export const AUDIO_STORAGE_KEYS = {
  MUSIC_ENABLED: 'nexus_tictactoe_music_enabled',
  SOUND_ENABLED: 'nexus_tictactoe_sound_enabled',
  MUSIC_VOLUME: 'nexus_tictactoe_music_volume',
};

export const PLAYER_CONFIG = {
  [GAME_MODES.PVP]: {
    [PLAYERS.X]: {
      name: 'PLAYER 1',
      symbol: 'X',
      color: 'cyan',
      textColor: 'text-cyan',
      borderColor: 'border-cyan',
      glowColor: 'shadow-glow-cyan',
      bgGlow: 'bg-cyan/10',
    },
    [PLAYERS.O]: {
      name: 'PLAYER 2',
      symbol: 'O',
      color: 'purple',
      textColor: 'text-purple-400',
      borderColor: 'border-purple-500',
      glowColor: 'shadow-glow-purple',
      bgGlow: 'bg-purple-500/10',
    },
  },
  [GAME_MODES.PVC]: {
    [PLAYERS.X]: {
      name: 'YOU',
      symbol: 'X',
      color: 'cyan',
      textColor: 'text-cyan',
      borderColor: 'border-cyan',
      glowColor: 'shadow-glow-cyan',
      bgGlow: 'bg-cyan/10',
    },
    [PLAYERS.O]: {
      name: 'COMPUTER',
      symbol: 'O',
      color: 'purple',
      textColor: 'text-purple-400',
      borderColor: 'border-purple-500',
      glowColor: 'shadow-glow-purple',
      bgGlow: 'bg-purple-500/10',
    },
  },
};

