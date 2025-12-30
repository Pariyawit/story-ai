import { useState, useEffect } from 'react';
import { StoryBeat, Gender, Language, StoryTheme } from '@/types';
import { postStory } from '@/services/storyClient';
// import { useLocalStorage } from './useLocalStorage';

type GameState = 'START' | 'STORY' | 'TRANSITION';

// Initial transition texts shown when starting a new adventure
const getInitialTransitionTexts = (playerName: string, language: Language): string[] => {
  if (language === 'th') {
    return [
      `🌟 สวัสดี ${playerName}! การผจญภัยของเธอกำลังจะเริ่มต้น...`,
      '📚 หนังสือวิเศษกำลังเปิดหน้าใหม่ให้เธอ...',
      '✨ โลกแห่งจินตนาการกำลังรอเธออยู่!',
      '🎭 เตรียมพร้อมสำหรับการเดินทางที่น่าตื่นเต้น...',
    ];
  }
  return [
    `🌟 Hello ${playerName}! Your adventure is about to begin...`,
    '📚 A magical book is opening its pages just for you...',
    '✨ A world of imagination awaits!',
    '🎭 Get ready for an exciting journey...',
  ];
};

interface UseStoryGameReturn {
  gameState: GameState;
  playerName: string;
  nameInput: string;
  gender: Gender;
  language: Language;
  theme: StoryTheme;
  history: StoryBeat[];
  currentBeat: StoryBeat | null;
  currentPage: number;
  isLoading: boolean;
  transitionTexts: string[];
  setNameInput: (name: string) => void;
  setGender: (gender: Gender) => void;
  setLanguage: (language: Language) => void;
  setTheme: (theme: StoryTheme) => void;
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
  const [history, setHistory] = useState<StoryBeat[]>([]);
  // const [history, setHistory] = useLocalStorage<StoryBeat[]>(
  //   'story-history',
  //   []
  // );
  const [currentBeat, setCurrentBeat] = useState<StoryBeat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transitionTexts, setTransitionTexts] = useState<string[]>([]);

  // Load theme from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('story-theme') as StoryTheme | null;
      if (savedTheme && ['enchanted_forest', 'space_adventure', 'underwater_kingdom', 'dinosaur_land', 'fairy_tale_castle'].includes(savedTheme)) {
        setThemeState(savedTheme);
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
        const initialBeat = await postStory(name, [], gender, language, theme);
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
    const selectedTransition = currentBeat.choicesWithTransition?.find(
      c => c.text === choice
    );

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
    setHistory(updatedHistory);
    try {
      const nextBeat = await postStory(playerName, updatedHistory, gender, language, theme);
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
  };
}
