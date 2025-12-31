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
    theme,
    character,
    history,
    currentBeat,
    currentPage,
    isLoading,
    transitionTexts,
    setNameInput,
    setGender,
    setLanguage,
    setTheme,
    setCharacter,
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
        theme={theme}
        character={character}
        onNameChange={setNameInput}
        onGenderChange={setGender}
        onLanguageChange={setLanguage}
        onThemeChange={setTheme}
        onCharacterChange={setCharacter}
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
