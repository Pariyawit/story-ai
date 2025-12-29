'use client';

import { StoryBeat, Language } from '@/types';
import StoryImage from './StoryImage';
import StoryText from './StoryText';
import ChoiceButtons from './ChoiceButtons';

interface StoryScreenProps {
  playerName: string;
  currentBeat: StoryBeat | null;
  currentPage: number;
  history: StoryBeat[];
  language: Language;
  isLoading: boolean;
  onChoice: (choice: string) => void;
  onRestart: () => void;
}

export default function StoryScreen({
  playerName,
  currentBeat,
  currentPage,
  history,
  language,
  isLoading,
  onChoice,
  onRestart,
}: StoryScreenProps) {
  const isStoryEnded = !isLoading && (!currentBeat?.choices || currentBeat.choices.length === 0);

  // Combine all story beats into one full story
  const getFullStory = () => {
    const allBeats = [...history];
    if (currentBeat) {
      allBeats.push(currentBeat);
    }
    return allBeats.map(beat => beat.storyText).join(' ');
  };

  return (
    <div className='relative flex min-h-screen w-full flex-col bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 md:flex-row md:items-center'>
      {/* Player Name and Page Display */}
      <div className='absolute right-4 top-4 z-10 flex flex-col items-end gap-2'>
        <div className='rounded-3xl bg-white/80 px-4 py-2 shadow-md backdrop-blur-sm'>
          <p className='text-sm font-medium text-purple-600'>{playerName}</p>
        </div>
        <div className='rounded-2xl bg-purple-500/90 px-3 py-1 shadow-md backdrop-blur-sm'>
          <p className='text-sm font-bold text-white'>
            {language === 'th' ? `หน้า ${currentPage}/12` : `Page ${currentPage}/12`}
          </p>
        </div>
      </div>

      {/* Left Side: Image */}
      <StoryImage
        imageUrl={currentBeat?.imageUrl}
        imagePrompt={currentBeat?.imagePrompt}
        isLoading={isLoading}
      />

      {/* Right Side: Story Text and Choices */}
      <div className='flex w-full flex-col p-4 md:w-1/2 md:p-6 lg:p-8'>
        {isStoryEnded ? (
          <StoryText 
            text={getFullStory()} 
            isLoading={isLoading} 
            title={language === 'th' ? '📖 เรื่องราวทั้งหมด' : '📖 The Complete Story'}
          />
        ) : (
          <StoryText text={currentBeat?.storyText} isLoading={isLoading} />
        )}
        <ChoiceButtons
          choices={currentBeat?.choices}
          onChoice={onChoice}
          onRestart={onRestart}
          isLoading={isLoading}
          language={language}
        />
      </div>
    </div>
  );
}
