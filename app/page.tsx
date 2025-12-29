'use client';

import { useStoryGame } from './hooks/useStoryGame';
import StartScreen from './components/story/StartScreen';
import StoryScreen from './components/story/StoryScreen';
import TransitionScreen from './components/story/TransitionScreen';

export default function Home() {
  const {
    gameState,
    playerName,
    nameInput,
    gender,
    language,
    history,
    currentBeat,
    currentPage,
    isLoading,
    transitionTexts,
    setNameInput,
    setGender,
    setLanguage,
    handleNameSubmit,
    handleChoice,
    handleRestart,
  } = useStoryGame();

  if (gameState === 'START') {
    return (
      <StartScreen
        nameInput={nameInput}
        gender={gender}
        language={language}
        onNameChange={setNameInput}
        onGenderChange={setGender}
        onLanguageChange={setLanguage}
        onSubmit={handleNameSubmit}
        isLoading={isLoading}
      />
    );
  }

  if (gameState === 'TRANSITION' && transitionTexts.length > 0) {
    return <TransitionScreen transitionTexts={transitionTexts} language={language} />;
  }

  return (
    <StoryScreen
      playerName={playerName}
      currentBeat={currentBeat}
      currentPage={currentPage}
      history={history}
      language={language}
      isLoading={isLoading}
      onChoice={handleChoice}
      onRestart={handleRestart}
    />
  );
}
