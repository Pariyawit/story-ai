import { useState } from 'react';
import { StoryBeat, Gender, Language } from '@/types';
import { postStory } from '@/services/storyClient';
// import { useLocalStorage } from './useLocalStorage';

type GameState = 'START' | 'STORY' | 'TRANSITION';

interface UseStoryGameReturn {
  gameState: GameState;
  playerName: string;
  nameInput: string;
  gender: Gender;
  language: Language;
  history: StoryBeat[];
  currentBeat: StoryBeat | null;
  currentPage: number;
  isLoading: boolean;
  transitionTexts: string[];
  setNameInput: (name: string) => void;
  setGender: (gender: Gender) => void;
  setLanguage: (language: Language) => void;
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
  const [history, setHistory] = useState<StoryBeat[]>([]);
  // const [history, setHistory] = useLocalStorage<StoryBeat[]>(
  //   'story-history',
  //   []
  // );
  const [currentBeat, setCurrentBeat] = useState<StoryBeat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transitionTexts, setTransitionTexts] = useState<string[]>([]);

  const currentPage = history.length + 1;

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      const name = nameInput.trim();
      setPlayerName(name);
      setGameState('STORY');
      setIsLoading(true);

      try {
        const initialBeat = await postStory(name, [], gender, language);
        setCurrentBeat(initialBeat);
        // setHistory([initialBeat]);
      } catch (error) {
        console.error('Failed to get initial story:', error);
      } finally {
        setIsLoading(false);
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
      const nextBeat = await postStory(playerName, updatedHistory, gender, language);
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
  };
}
