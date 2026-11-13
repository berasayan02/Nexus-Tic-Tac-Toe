import { useState, useEffect, useRef } from 'react';
import { GAME_MODES, PLAYERS, GAME_STATUS } from '../utils/constants';
import { getBestMove } from '../utils/minimax';

/**
 * Hook to manage computer AI turns and thinking state
 */
export const useComputer = ({
  gameMode,
  gameStatus,
  currentPlayer,
  board,
  makeMove,
}) => {
  const [isComputerThinking, setIsComputerThinking] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    // Only trigger if in PvC mode, playing, and it's Computer's turn (O)
    if (
      gameMode === GAME_MODES.PVC &&
      gameStatus === GAME_STATUS.PLAYING &&
      currentPlayer === PLAYERS.O
    ) {
      setIsComputerThinking(true);

      // Add a natural 550ms - 750ms thinking delay for futuristic AI feel
      const delay = Math.floor(Math.random() * 200) + 550;

      timerRef.current = setTimeout(() => {
        const bestMove = getBestMove(board);
        if (bestMove !== null) {
          makeMove(bestMove);
        }
        setIsComputerThinking(false);
      }, delay);
    } else {
      setIsComputerThinking(false);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [gameMode, gameStatus, currentPlayer, board, makeMove]);

  return {
    isComputerThinking,
  };
};

