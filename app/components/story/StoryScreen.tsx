'use client';

import { StoryBeat } from '@/types';
import StoryImage from './StoryImage';
import StoryText from './StoryText';
import ChoiceButtons from './ChoiceButtons';

interface StoryScreenProps {
  playerName: string;
  currentBeat: StoryBeat | null;
  isLoading: boolean;
  onChoice: (choice: string) => void;
  onRestart: () => void;
}

export default function StoryScreen({
  playerName,
  currentBeat,
  isLoading,
  onChoice,
  onRestart,
}: StoryScreenProps) {
  return (
    <div className='relative flex min-h-screen w-full flex-col bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 md:flex-row md:items-center'>
      {/* Player Name Display */}
      <div className='absolute right-4 top-4 z-10 rounded-3xl bg-white/80 px-4 py-2 shadow-md backdrop-blur-sm'>
        <p className='text-sm font-medium text-purple-600'>{playerName}</p>
      </div>

      {/* Left Side: Image */}
      <StoryImage
        imageUrl={currentBeat?.imageUrl}
        imagePrompt={currentBeat?.imagePrompt}
        isLoading={isLoading}
      />

      {/* Right Side: Story Text and Choices */}
      <div className='flex w-full flex-col p-4 md:w-1/2 md:p-6 lg:p-8'>
        <StoryText text={currentBeat?.storyText} isLoading={isLoading} />
        <ChoiceButtons
          choices={currentBeat?.choices}
          onChoice={onChoice}
          onRestart={onRestart}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
