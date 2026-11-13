import {
  checkWinner,
  checkDraw,
  getAvailableMoves,
  evaluateGameState,
  hasMovesPlayed,
  createEmptyBoard,
} from '../src/utils/gameLogic.js';
import { getBestMove } from '../src/utils/minimax.js';
import { WINNING_COMBINATIONS, PLAYERS, GAME_STATUS } from '../src/utils/constants.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`✅ PASS: ${message}`);
  } else {
    failed++;
    console.error(`❌ FAIL: ${message}`);
  }
}

console.log('--- 1. TESTING ALL 8 WINNING COMBINATIONS ---');
WINNING_COMBINATIONS.forEach((combo, idx) => {
  const board = createEmptyBoard();
  combo.indices.forEach((pos) => {
    board[pos] = PLAYERS.X;
  });
  const win = checkWinner(board);
  assert(
    win && win.winner === PLAYERS.X && win.combination === combo,
    `Winning combination #${idx + 1} (${combo.label}) detected accurately for X`
  );
});

console.log('\n--- 2. TESTING DRAW DETECTION ---');
// Draw board:
// X O X
// X O O
// O X X
const drawBoard = [
  'X', 'O', 'X',
  'X', 'O', 'O',
  'O', 'X', 'X',
];
assert(checkDraw(drawBoard) === true, 'Draw board correctly identified as draw');
assert(checkWinner(drawBoard) === null, 'Draw board has no winner');

console.log('\n--- 3. TESTING EMPTY & IN-PROGRESS DETECTION ---');
const empty = createEmptyBoard();
assert(hasMovesPlayed(empty) === false, 'Fresh board has no moves played');
empty[0] = 'X';
assert(hasMovesPlayed(empty) === true, 'Board with 1 move reports hasMovesPlayed true');

console.log('\n--- 4. TESTING MINIMAX AI UNBEATABLE PROOF ---');
// Exhaustive test: Simulate game where Human plays random valid moves and Minimax plays as O.
// Minimax must NEVER lose (Human X can never win).
let aiWins = 0;
let draws = 0;
let humanWins = 0;

function simulateGame(currentBoard, turn) {
  const state = evaluateGameState(currentBoard);
  if (state.status === GAME_STATUS.WON) {
    if (state.winner === PLAYERS.X) humanWins++;
    if (state.winner === PLAYERS.O) aiWins++;
    return;
  }
  if (state.status === GAME_STATUS.DRAW) {
    draws++;
    return;
  }

  if (turn === PLAYERS.O) {
    // Computer move using Minimax
    const bestMove = getBestMove(currentBoard);
    const nextBoard = [...currentBoard];
    nextBoard[bestMove] = PLAYERS.O;
    simulateGame(nextBoard, PLAYERS.X);
  } else {
    // Human plays all possible branch moves to test complete game tree or sample branches
    const available = getAvailableMoves(currentBoard);
    for (const move of available) {
      const nextBoard = [...currentBoard];
      nextBoard[move] = PLAYERS.X;
      simulateGame(nextBoard, PLAYERS.O);
    }
  }
}

// Run simulation from start where human plays any first move
const startBoard = createEmptyBoard();
simulateGame(startBoard, PLAYERS.X);

console.log(`Simulation complete: AI Wins: ${aiWins}, Draws: ${draws}, Human Wins: ${humanWins}`);
assert(humanWins === 0, 'Minimax is mathematically UNBEATABLE (0 human wins across entire game tree)');

console.log(`\n========================================`);
console.log(`Summary: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);

