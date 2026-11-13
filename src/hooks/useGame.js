import { useState, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  GAME_MODES,
  PLAYERS,
  GAME_STATUS,
} from '../utils/constants';
import {
  createEmptyBoard,
  evaluateGameState,
  hasMovesPlayed,
} from '../utils/gameLogic';
import { useComputer } from './useComputer';

export const useGame = (audio) => {
  const [board, setBoard] = useState(createEmptyBoard);
  const [currentPlayer, setCurrentPlayer] = useState(PLAYERS.X);
  const [gameMode, setGameMode] = useState(GAME_MODES.PVP);
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.PLAYING);
  const [winner, setWinner] = useState(null);
  const [winningCombination, setWinningCombination] = useState(null);

  // Modal states for mode switching confirmation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingGameMode, setPendingGameMode] = useState(null);

  // Lock to avoid double click race conditions
  const isProcessingMoveRef = useRef(false);

  // Trigger celebration confetti
  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f3ff', '#b026ff', '#ffffff', '#38bdf8', '#c084fc'],
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  // Make move implementation
  const makeMove = useCallback(
    (index) => {
      // Validate
      if (
        board[index] !== null ||
        gameStatus !== GAME_STATUS.PLAYING ||
        isProcessingMoveRef.current
      ) {
        return false;
      }

      isProcessingMoveRef.current = true;

      const playerWhoMoved = currentPlayer;
      const nextBoard = [...board];
      nextBoard[index] = playerWhoMoved;
      setBoard(nextBoard);

      // Play sound
      if (playerWhoMoved === PLAYERS.X) {
        audio.playXMove();
      } else {
        audio.playOMove();
      }

      // Check results
      const result = evaluateGameState(nextBoard);

      if (result.status === GAME_STATUS.WON) {
        setGameStatus(GAME_STATUS.WON);
        setWinner(result.winner);
        setWinningCombination(result.combination);
        audio.playWin();
        triggerConfetti();
      } else if (result.status === GAME_STATUS.DRAW) {
        setGameStatus(GAME_STATUS.DRAW);
        setWinner(null);
        setWinningCombination(null);
        audio.playDraw();
      } else {
        // Toggle turn
        const nextPlayer = playerWhoMoved === PLAYERS.X ? PLAYERS.O : PLAYERS.X;
        setCurrentPlayer(nextPlayer);
        audio.playTurnChange();
      }

      isProcessingMoveRef.current = false;
      return true;
    },
    [board, gameStatus, currentPlayer, audio, triggerConfetti]
  );

  // Handle cell click by human player
  const handleCellClick = useCallback(
    (index) => {
      audio.handleUserInteraction();

      // In PvC mode, human is X. If current player is O, ignore click.
      if (gameMode === GAME_MODES.PVC && currentPlayer !== PLAYERS.X) {
        return;
      }

      // If computer is thinking or game is over, ignore
      if (gameStatus !== GAME_STATUS.PLAYING) {
        return;
      }

      makeMove(index);
    },
    [audio, gameMode, currentPlayer, gameStatus, makeMove]
  );

  // Initialize computer AI hook
  const { isComputerThinking } = useComputer({
    gameMode,
    gameStatus,
    currentPlayer,
    board,
    makeMove,
  });

  // Switch mode requested by user
  const handleSelectMode = useCallback(
    (targetMode) => {
      audio.handleUserInteraction();

      // Rule: If user selects the already active mode, do nothing
      if (targetMode === gameMode) {
        return;
      }

      // Check if match is in progress with played moves
      const isMatchInProgress =
        hasMovesPlayed(board) && gameStatus === GAME_STATUS.PLAYING;

      if (isMatchInProgress) {
        // Show confirmation modal
        setPendingGameMode(targetMode);
        setIsModalOpen(true);
        audio.playModalOpen();
      } else {
        // No match in progress (or match already finished) -> switch directly
        setGameMode(targetMode);
        setBoard(createEmptyBoard());
        setCurrentPlayer(PLAYERS.X);
        setGameStatus(GAME_STATUS.PLAYING);
        setWinner(null);
        setWinningCombination(null);
        audio.playModeSwitch();
      }
    },
    [audio, board, gameMode, gameStatus]
  );

  // Confirm mode switch in modal
  const confirmModeSwitch = useCallback(() => {
    if (pendingGameMode) {
      setGameMode(pendingGameMode);
      setBoard(createEmptyBoard());
      setCurrentPlayer(PLAYERS.X);
      setGameStatus(GAME_STATUS.PLAYING);
      setWinner(null);
      setWinningCombination(null);
      setPendingGameMode(null);
      setIsModalOpen(false);
      audio.playModeSwitch();
    }
  }, [pendingGameMode, audio]);

  // Cancel mode switch in modal
  const cancelModeSwitch = useCallback(() => {
    setPendingGameMode(null);
    setIsModalOpen(false);
    audio.playModalClose();
  }, [audio]);

  // Restart match (available ONLY after match has ended)
  const restartMatch = useCallback(() => {
    audio.handleUserInteraction();
    setBoard(createEmptyBoard());
    setCurrentPlayer(PLAYERS.X);
    setGameStatus(GAME_STATUS.PLAYING);
    setWinner(null);
    setWinningCombination(null);
    audio.playRestart();
  }, [audio]);

  return {
    board,
    currentPlayer,
    gameMode,
    gameStatus,
    winner,
    winningCombination,
    isComputerThinking,
    isModalOpen,
    pendingGameMode,
    handleCellClick,
    handleSelectMode,
    confirmModeSwitch,
    cancelModeSwitch,
    restartMatch,
  };
};

