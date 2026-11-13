import React from 'react';
import { GameCell } from './GameCell';
import { WinningLine } from './WinningLine';
import { GAME_STATUS } from '../utils/constants';

export const GameBoard = ({
  board,
  onCellClick,
  winningCombination,
  winner,
  gameStatus,
  isComputerThinking,
  currentPlayer,
}) => {
  const isMatchEnded = gameStatus !== GAME_STATUS.PLAYING;
  const isInteractionDisabled = isMatchEnded || isComputerThinking;

  const winningIndices = winningCombination ? winningCombination.indices : [];

  return (
    <div className="relative w-full max-w-[360px] sm:max-w-[400px] md:max-w-[430px] mx-auto aspect-square p-2.5 sm:p-4 rounded-3xl glass-panel border border-white/10 shadow-2xl backdrop-blur-2xl">
      {/* Outer ambient border light */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan/10 via-transparent to-purple-600/10 pointer-events-none" />

      {/* 3x3 Grid */}
      <div className="relative z-10 w-full h-full grid grid-cols-3 grid-rows-3 gap-2 sm:gap-3">
        {board.map((cellValue, idx) => (
          <GameCell
            key={idx}
            index={idx}
            value={cellValue}
            onClick={() => onCellClick(idx)}
            isWinningCell={winningIndices.includes(idx)}
            disabled={isInteractionDisabled}
            turnSymbol={currentPlayer}
          />
        ))}
      </div>

      {/* Animated Winning Line across winning combination */}
      {winningCombination && (
        <WinningLine combination={winningCombination} winner={winner} />
      )}
    </div>
  );
};

