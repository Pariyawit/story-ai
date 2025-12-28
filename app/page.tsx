'use client';

import { useStoryGame } from './hooks/useStoryGame';
import StartScreen from './components/story/StartScreen';
import StoryScreen from './components/story/StoryScreen';

export default function Home() {
  const {
    gameState,
    playerName,
    nameInput,
    currentBeat,
    isLoading,
    setNameInput,
    handleNameSubmit,
    handleChoice,
    handleRestart,
  } = useStoryGame();

  if (gameState === 'START') {
    return (
      <StartScreen
        nameInput={nameInput}
        onNameChange={setNameInput}
        onSubmit={handleNameSubmit}
        isLoading={isLoading}
      />
    );
  }

  return (
    <StoryScreen
      playerName={playerName}
      currentBeat={currentBeat}
      isLoading={isLoading}
      onChoice={handleChoice}
      onRestart={handleRestart}
    />
  );
}
