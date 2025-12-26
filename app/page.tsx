'use client';

import { useState, useEffect } from 'react';

// Type definitions
type GameState = 'START' | 'STORY';

interface StoryBeat {
  text: string;
  choices: string[];
  imagePlaceholder: string;
}

// Mock API function - returns hardcoded story beat after 1 second delay
const getMockResponse = async (choice?: string): Promise<StoryBeat> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    text: choice
      ? `You chose to ${choice.toLowerCase()}! The magical forest sparkles around you as new adventures await. Birds chirp happily and butterflies dance in the sunlight.`
      : 'Welcome to the Enchanted Forest! You find yourself standing at the edge of a beautiful meadow filled with colorful flowers. In the distance, you can see three paths leading into the forest.',
    choices: [
      'Follow the sparkling stream',
      'Climb the big friendly tree',
      'Explore the flower garden',
    ],
    imagePlaceholder:
      'A magical forest meadow with colorful flowers and three mysterious paths',
  };
};

export default function Home() {
  // State management
  const [gameState, setGameState] = useState<GameState>('START');
  const [playerName, setPlayerName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [history, setHistory] = useState<StoryBeat[]>([]);
  const [currentBeat, setCurrentBeat] = useState<StoryBeat | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('story-history');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed);
      }
    } catch (error) {
      console.error('Failed to load history from localStorage:', error);
    }
  }, []);

  // Sync history to localStorage whenever it changes
  useEffect(() => {
    if (history.length > 0) {
      try {
        localStorage.setItem('story-history', JSON.stringify(history));
      } catch (error) {
        console.error('Failed to save history to localStorage:', error);
      }
    }
  }, [history]);

  // Handle name submission
  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setPlayerName(nameInput.trim());
      setGameState('STORY');
      setIsLoading(true);

      try {
        const initialBeat = await getMockResponse();
        setCurrentBeat(initialBeat);
        setHistory([initialBeat]);
      } catch (error) {
        console.error('Failed to get initial story:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle choice selection
  const handleChoice = async (choice: string) => {
    setIsLoading(true);

    try {
      const nextBeat = await getMockResponse(choice);
      setCurrentBeat(nextBeat);
      setHistory((prev) => [...prev, nextBeat]);
    } catch (error) {
      console.error('Failed to get next story beat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // START screen
  if (gameState === 'START') {
    return (
      <div className='flex min-h-screen w-full items-center justify-center  bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100'>
        <div className='w-full max-w-md px-8'>
          <div className='rounded-3xl bg-white/80 p-8 shadow-lg backdrop-blur-sm'>
            <h1 className='mb-6 text-center text-4xl font-bold text-purple-600'>
              Story Adventure
            </h1>
            <p className='mb-8 text-center text-lg text-purple-500'>
              What&apos;s your name, brave explorer?
            </p>

            <form onSubmit={handleNameSubmit} className='space-y-4'>
              <div>
                <label htmlFor='name-input' className='sr-only'>
                  Your name
                </label>
                <input
                  id='name-input'
                  type='text'
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder='Enter your name...'
                  className='w-full rounded-3xl border-2 border-purple-200 bg-white px-6 py-4 text-lg text-purple-900 placeholder-purple-300 transition-colors focus:border-purple-400 focus:outline-none'
                  autoFocus
                />
              </div>

              <button
                type='submit'
                disabled={!nameInput.trim()}
                className='w-full rounded-3xl bg-gradient-to-r from-purple-400 to-pink-400 px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:from-purple-500 hover:to-pink-500 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Start Adventure
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // STORY screen
  return (
    <div className='relative flex min-h-screen w-full flex-col bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 md:flex-row md:items-center'>
      {/* Player Name Display */}
      <div className='absolute right-4 top-4 z-10 rounded-3xl bg-white/80 px-4 py-2 shadow-md backdrop-blur-sm'>
        <p className='text-sm font-medium text-purple-600'>{playerName}</p>
      </div>

      {/* Left Side: Image (Mobile: top, Tablet+: left side) */}
      <div className='w-full p-4 md:w-1/2 md:p-6 lg:p-8'>
        <div className='flex items-center justify-center'>
          <div className='w-full max-w-2xl md:max-w-none'>
            <div className='aspect-[5/4] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 shadow-lg'>
              <div className='flex h-full w-full items-center justify-center p-8 text-center'>
                <p className='text-xl font-medium text-purple-700'>
                  {currentBeat?.imagePlaceholder || 'Loading...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Story Text and Choices (Mobile: bottom, Tablet+: right side) */}
      <div className='flex w-full flex-col p-4 md:w-1/2 md:p-6 lg:p-8'>
        {/* Story Text */}
        <div className='overflow-y-auto'>
          <div className='rounded-3xl bg-white/80 p-6 shadow-md backdrop-blur-sm'>
            {isLoading ? (
              <div className='flex items-center justify-center py-4'>
                <div className='h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600'></div>
              </div>
            ) : (
              <p className='text-lg leading-relaxed text-purple-900'>
                {currentBeat?.text || 'Your adventure begins...'}
              </p>
            )}
          </div>
        </div>

        {/* Choice Buttons */}
        <div className='mt-4 flex w-full flex-shrink-0 items-center justify-center'>
          <div className='w-full space-y-4'>
            {currentBeat?.choices.map((choice, index) => {
              const colors = [
                'from-pink-300 to-rose-300 hover:from-pink-400 hover:to-rose-400',
                'from-blue-300 to-cyan-300 hover:from-blue-400 hover:to-cyan-400',
                'from-purple-300 to-violet-300 hover:from-purple-400 hover:to-violet-400',
              ];

              return (
                <button
                  key={index}
                  onClick={() => handleChoice(choice)}
                  disabled={isLoading}
                  className={`w-full rounded-3xl bg-gradient-to-r ${colors[index]} px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {choice}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
