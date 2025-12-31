"use client";

import StartScreen from "./components/story/StartScreen";
import StoryScreen from "./components/story/StoryScreen";
import TransitionScreen from "./components/story/TransitionScreen";
import { useStoryGame } from "./hooks/useStoryGame";

export default function Home() {
  const {
    gameState,
    playerName,
    nameInput,
    gender,
    language,
    theme,
    history,
    currentBeat,
    currentPage,
    isLoading,
    transitionTexts,
    setNameInput,
    setGender,
    setLanguage,
    setTheme,
    handleNameSubmit,
    handleChoice,
    handleRestart,
  } = useStoryGame();

  if (gameState === "START") {
    return (
      <StartScreen
        nameInput={nameInput}
        gender={gender}
        language={language}
        theme={theme}
        onNameChange={setNameInput}
        onGenderChange={setGender}
        onLanguageChange={setLanguage}
        onThemeChange={setTheme}
        onSubmit={handleNameSubmit}
        isLoading={isLoading}
      />
    );
  }

  if (gameState === "TRANSITION" && transitionTexts.length > 0) {
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
