import { WINNING_COMBINATIONS, PLAYERS, GAME_STATUS } from './constants.js';

/**
 * Creates a fresh 3x3 board representation (array of 9 nulls)
 */
export const createEmptyBoard = () => Array(9).fill(null);

/**
 * Checks if there's a winner on the board
 * @param {Array<string|null>} board
 * @returns {{ winner: string, combination: object } | null}
 */
export const checkWinner = (board) => {
  for (const combo of WINNING_COMBINATIONS) {
    const [a, b, c] = combo.indices;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winner: board[a],
        combination: combo,
      };
    }
  }
  return null;
};

/**
 * Checks if the board has reached a draw state
 * @param {Array<string|null>} board
 * @returns {boolean}
 */
export const checkDraw = (board) => {
  const isFull = board.every((cell) => cell !== null);
  const win = checkWinner(board);
  return isFull && !win;
};

/**
 * Returns all available cell indices (0 to 8)
 * @param {Array<string|null>} board
 * @returns {Array<number>}
 */
export const getAvailableMoves = (board) => {
  const moves = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      moves.push(i);
    }
  }
  return moves;
};

/**
 * Checks if any moves have been played on the board
 * @param {Array<string|null>} board
 * @returns {boolean}
 */
export const hasMovesPlayed = (board) => {
  return board.some((cell) => cell !== null);
};

/**
 * Determines current game status given board state
 * @param {Array<string|null>} board
 * @returns {{ status: string, winner: string|null, combination: object|null }}
 */
export const evaluateGameState = (board) => {
  const winResult = checkWinner(board);
  if (winResult) {
    return {
      status: GAME_STATUS.WON,
      winner: winResult.winner,
      combination: winResult.combination,
    };
  }

  if (checkDraw(board)) {
    return {
      status: GAME_STATUS.DRAW,
      winner: null,
      combination: null,
    };
  }

  return {
    status: GAME_STATUS.PLAYING,
    winner: null,
    combination: null,
  };
};
