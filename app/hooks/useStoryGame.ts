import { use, useState } from 'react';
import { StoryBeat } from '@/types';
import { postStory } from '@/services/storyClient';
// import { useLocalStorage } from './useLocalStorage';

type GameState = 'START' | 'STORY';

interface UseStoryGameReturn {
  gameState: GameState;
  playerName: string;
  nameInput: string;
  history: StoryBeat[];
  currentBeat: StoryBeat | null;
  isLoading: boolean;
  setNameInput: (name: string) => void;
  handleNameSubmit: (e: React.FormEvent) => Promise<void>;
  handleChoice: (choice: string) => Promise<void>;
  handleRestart: () => void;
}

export function useStoryGame(): UseStoryGameReturn {
  const [gameState, setGameState] = useState<GameState>('START');
  const [playerName, setPlayerName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [history, setHistory] = useState<StoryBeat[]>([]);
  // const [history, setHistory] = useLocalStorage<StoryBeat[]>(
  //   'story-history',
  //   []
  // );
  const [currentBeat, setCurrentBeat] = useState<StoryBeat | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      const name = nameInput.trim();
      setPlayerName(name);
      setGameState('STORY');
      setIsLoading(true);

      try {
        const initialBeat = await postStory(name, []);
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
      const nextBeat = await postStory(playerName, updatedHistory);
      setCurrentBeat(nextBeat);
    } catch (error) {
      console.error('Failed to get next story beat:', error);
    } finally {
      setIsLoading(false);
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
    setHistory([]);
    setCurrentBeat(null);
    setIsLoading(false);
  };

  return {
    gameState,
    playerName,
    nameInput,
    history,
    currentBeat,
    isLoading,
    setNameInput,
    handleNameSubmit,
    handleChoice,
    handleRestart,
  };
}
