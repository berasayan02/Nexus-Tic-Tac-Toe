import React from 'react';
import { motion } from 'framer-motion';
import { useAudio } from './hooks/useAudio';
import { useGame } from './hooks/useGame';
import { Header } from './components/Header';
import { GameModeSelector } from './components/GameModeSelector';
import { PlayerCard } from './components/PlayerCard';
import { TurnIndicator } from './components/TurnIndicator';
import { GameBoard } from './components/GameBoard';
import { ResultModal } from './components/ResultModal';
import { ConfirmModal } from './components/ConfirmModal';
import { BackgroundEffects } from './components/BackgroundEffects';
import { Footer } from './components/Footer';
import { PLAYERS, PLAYER_CONFIG } from './utils/constants';

export function App() {
  const audio = useAudio();
  const game = useGame(audio);

  const player1Config = PLAYER_CONFIG[game.gameMode][PLAYERS.X];
  const player2Config = PLAYER_CONFIG[game.gameMode][PLAYERS.O];

  return (
    <div
      onClick={audio.handleUserInteraction}
      className="relative min-h-[100dvh] w-full bg-dark-950 text-slate-100 flex flex-col justify-between p-2.5 sm:p-4 md:p-6 overflow-x-hidden selection:bg-cyan selection:text-black font-sans"
    >
      {/* Dynamic Animated Ambient Background */}
      <BackgroundEffects />

      {/* Main Container - max-w-4xl, centered, constrained */}
      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col flex-1 justify-between my-auto">
        {/* Top Section: Header & Mode Selector */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <Header
            musicEnabled={audio.musicEnabled}
            setMusicEnabled={audio.setMusicEnabled}
            soundEnabled={audio.soundEnabled}
            setSoundEnabled={audio.setSoundEnabled}
            musicVolume={audio.musicVolume}
            setMusicVolume={audio.setMusicVolume}
            playButtonClick={audio.playButtonClick}
          />

          <GameModeSelector
            currentGameMode={game.gameMode}
            onSelectMode={game.handleSelectMode}
            playButtonClick={audio.playButtonClick}
          />
        </motion.div>

        {/* Middle Section: Player Cards, Turn Indicator & Game Board */}
        <main className="w-full flex flex-col items-center justify-center my-auto py-1 sm:py-2">
          {/* Player Information Panel */}
          <div className="w-full max-w-md grid grid-cols-2 gap-2.5 sm:gap-4 mb-2.5 sm:mb-3">
            <PlayerCard
              playerSymbol={PLAYERS.X}
              playerConfig={player1Config}
              isActive={game.currentPlayer === PLAYERS.X && game.gameStatus === 'playing'}
              isThinking={false}
              gameMode={game.gameMode}
            />
            <PlayerCard
              playerSymbol={PLAYERS.O}
              playerConfig={player2Config}
              isActive={game.currentPlayer === PLAYERS.O && game.gameStatus === 'playing'}
              isThinking={game.isComputerThinking}
              gameMode={game.gameMode}
            />
          </div>

          {/* Turn Indicator */}
          <TurnIndicator
            currentPlayer={game.currentPlayer}
            gameMode={game.gameMode}
            isComputerThinking={game.isComputerThinking}
          />

          {/* The Game Board */}
          <GameBoard
            board={game.board}
            onCellClick={game.handleCellClick}
            winningCombination={game.winningCombination}
            winner={game.winner}
            gameStatus={game.gameStatus}
            isComputerThinking={game.isComputerThinking}
            currentPlayer={game.currentPlayer}
          />
        </main>

        {/* Existing text */}
        <div className="w-full text-center pt-1 text-[10px] sm:text-xs text-slate-500 tracking-wider">
          <span>PRECISION ENGINE • MINIMAX AI • WEB AUDIO SYNTHESIS</span>
        </div>

        {/* New Footer */}
        <Footer />
      </div>

      {/* Confirmation Modal when switching mode during an active match */}
      <ConfirmModal
        isOpen={game.isModalOpen}
        onConfirm={game.confirmModeSwitch}
        onCancel={game.cancelModeSwitch}
        playButtonClick={audio.playButtonClick}
      />

      {/* Result Overlay shown when a match ends */}
      <ResultModal
        gameStatus={game.gameStatus}
        winner={game.winner}
        gameMode={game.gameMode}
        onRestart={game.restartMatch}
        playButtonClick={audio.playButtonClick}
      />
    </div>
  );
}

export default App;

