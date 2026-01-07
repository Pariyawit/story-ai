import { useState, useEffect } from 'react';

import { getInitialTransitionTexts } from '@/lib/i18n/prompts';
import { getUrlParams } from '@/lib/urlParams';
import { postStory } from '@/services/storyClient';
import { StoryBeat, Gender, Language, StoryTheme, CharacterCustomization } from '@/types';
// import { useLocalStorage } from './useLocalStorage';

// Default character customization
const DEFAULT_CHARACTER: CharacterCustomization = {
  hairColor: 'brown',
  hairStyle: 'short',
  outfitStyle: 'adventurer',
  favoriteColor: 'purple',
};

// Valid values for character customization (for localStorage validation)
const VALID_HAIR_COLORS = ['brown', 'black', 'blonde', 'red', 'blue', 'pink'];
const VALID_HAIR_STYLES = ['short', 'long', 'curly', 'braids', 'ponytail'];
const VALID_OUTFIT_STYLES = ['adventurer', 'princess', 'superhero', 'wizard', 'explorer'];
const VALID_FAVORITE_COLORS = ['purple', 'blue', 'pink', 'green', 'red', 'yellow'];

// Validate character from localStorage
const isValidCharacter = (char: unknown): char is CharacterCustomization => {
  if (!char || typeof char !== 'object') return false;
  const c = char as Record<string, unknown>;
  return (
    VALID_HAIR_COLORS.includes(c.hairColor as string) &&
    VALID_HAIR_STYLES.includes(c.hairStyle as string) &&
    VALID_OUTFIT_STYLES.includes(c.outfitStyle as string) &&
    VALID_FAVORITE_COLORS.includes(c.favoriteColor as string)
  );
};

type GameState = 'START' | 'STORY' | 'TRANSITION';

interface UseStoryGameReturn {
  gameState: GameState;
  playerName: string;
  nameInput: string;
  gender: Gender;
  language: Language;
  theme: StoryTheme;
  character: CharacterCustomization;
  history: StoryBeat[];
  currentBeat: StoryBeat | null;
  currentPage: number;
  isLoading: boolean;
  transitionTexts: string[];
  setNameInput: (name: string) => void;
  setGender: (gender: Gender) => void;
  setLanguage: (language: Language) => void;
  setTheme: (theme: StoryTheme) => void;
  setCharacter: (character: CharacterCustomization) => void;
  handleNameSubmit: (e: React.FormEvent) => Promise<void>;
  handleChoice: (choice: string) => Promise<void>;
  handleRestart: () => void;
}

export function useStoryGame(): UseStoryGameReturn {
  const [gameState, setGameState] = useState<GameState>('START');
  const [playerName, setPlayerName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [gender, setGender] = useState<Gender>('boy');
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setThemeState] = useState<StoryTheme>('enchanted_forest');
  const [characterState, setCharacterState] = useState<CharacterCustomization>(DEFAULT_CHARACTER);
  const [history, setHistory] = useState<StoryBeat[]>([]);
  // const [history, setHistory] = useLocalStorage<StoryBeat[]>(
  //   'story-history',
  //   []
  // );
  const [currentBeat, setCurrentBeat] = useState<StoryBeat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transitionTexts, setTransitionTexts] = useState<string[]>([]);

  // Load settings from URL params (priority) and localStorage (fallback) on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Get URL params first (they take priority)
      const urlParams = getUrlParams();

      // Apply URL params if present
      if (urlParams.name) {
        setNameInput(urlParams.name);
      }
      if (urlParams.gender) {
        setGender(urlParams.gender);
      }
      if (urlParams.language) {
        setLanguage(urlParams.language);
      }

      // Load theme: URL param > localStorage > default
      if (urlParams.theme) {
        setThemeState(urlParams.theme);
      } else {
        const savedTheme = localStorage.getItem('story-theme') as StoryTheme | null;
        if (
          savedTheme &&
          ['enchanted_forest', 'space_adventure', 'underwater_kingdom', 'dinosaur_land', 'fairy_tale_castle'].includes(
            savedTheme
          )
        ) {
          setThemeState(savedTheme);
        }
      }

      // Load character from localStorage (no URL param support for complex objects)
      try {
        const savedCharacterStr = localStorage.getItem('story-character');
        if (savedCharacterStr) {
          const savedCharacter = JSON.parse(savedCharacterStr);
          if (isValidCharacter(savedCharacter)) {
            setCharacterState(savedCharacter);
          }
        }
      } catch (error) {
        console.error('Failed to load character from localStorage:', error);
      }
    }
  }, []);

  // Save theme to localStorage when it changes
  const setTheme = (newTheme: StoryTheme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('story-theme', newTheme);
    }
  };

  // Save character to localStorage when it changes
  const setCharacter = (newCharacter: CharacterCustomization) => {
    setCharacterState(newCharacter);
    if (typeof window !== 'undefined') {
      localStorage.setItem('story-character', JSON.stringify(newCharacter));
    }
  };

  const currentPage = history.length + 1;

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      const name = nameInput.trim();
      setPlayerName(name);

      // Show engaging transition screen while generating initial story
      const initialTexts = getInitialTransitionTexts(name, language);
      setTransitionTexts(initialTexts);
      setGameState('TRANSITION');
      setIsLoading(true);

      try {
        const initialBeat = await postStory(name, [], gender, language, theme, characterState);
        setCurrentBeat(initialBeat);
        setGameState('STORY');
        // setHistory([initialBeat]);
      } catch (error) {
        console.error('Failed to get initial story:', error);
        setGameState('STORY');
      } finally {
        setIsLoading(false);
        setTransitionTexts([]);
      }
    }
  };

  const handleChoice = async (choice: string) => {
    if (!currentBeat) {
      return;
    }

    // Find transition texts for the selected choice
    const selectedTransition = currentBeat.choicesWithTransition?.find((c) => c.text === choice);

    if (selectedTransition?.transition && selectedTransition.transition.length > 0) {
      setTransitionTexts(selectedTransition.transition);
      setGameState('TRANSITION');
    }

    setIsLoading(true);
    const updatedHistory = [
      ...history,
      {
        ...currentBeat,
        selected: choice,
      },
    ];
    try {
      const nextBeat = await postStory(playerName, updatedHistory, gender, language, theme, characterState);
      setHistory(updatedHistory); // Only update history on success
      setCurrentBeat(nextBeat);
      setGameState('STORY');
    } catch (error) {
      console.error('Failed to get next story beat:', error);
      setGameState('STORY');
    } finally {
      setIsLoading(false);
      setTransitionTexts([]);
    }
  };

  const handleRestart = () => {
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('story-history');
    }

    // Reset all state
    setGameState('START');
    setPlayerName('');
    setNameInput('');
    setGender('boy');
    setLanguage('en');
    // Note: We don't reset theme - user's preference persists
    setHistory([]);
    setCurrentBeat(null);
    setIsLoading(false);
    setTransitionTexts([]);
  };

  return {
    gameState,
    playerName,
    nameInput,
    gender,
    language,
    theme,
    character: characterState,
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
  };
}
