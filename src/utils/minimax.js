import { checkWinner, getAvailableMoves } from './gameLogic.js';
import { PLAYERS } from './constants.js';

const HUMAN = PLAYERS.X;
const COMPUTER = PLAYERS.O;

/**
 * Minimax recursive evaluation function
 * @param {Array<string|null>} board
 * @param {number} depth
 * @param {boolean} isMaximizing
 * @returns {number} score
 */
function minimaxScore(board, depth, isMaximizing) {
  const winResult = checkWinner(board);

  if (winResult) {
    if (winResult.winner === COMPUTER) {
      return 10 - depth;
    } else if (winResult.winner === HUMAN) {
      return depth - 10;
    }
  }

  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) {
    return 0; // Draw
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of availableMoves) {
      board[move] = COMPUTER;
      const evaluation = minimaxScore(board, depth + 1, false);
      board[move] = null;
      maxEval = Math.max(maxEval, evaluation);
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of availableMoves) {
      board[move] = HUMAN;
      const evaluation = minimaxScore(board, depth + 1, true);
      board[move] = null;
      minEval = Math.min(minEval, evaluation);
    }
    return minEval;
  }
}

/**
 * Calculates the unbeatable optimal move for the computer
 * @param {Array<string|null>} board
 * @returns {number|null} The optimal cell index (0-8) or null if no moves
 */
export function getBestMove(board) {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) return null;

  // If board is completely empty (e.g. if computer went first), center or corner is best
  if (availableMoves.length === 9) {
    return 4; // Center
  }

  let bestScore = -Infinity;
  let bestMove = availableMoves[0];

  for (const move of availableMoves) {
    board[move] = COMPUTER;
    const score = minimaxScore(board, 0, false);
    board[move] = null;

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}
