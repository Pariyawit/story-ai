'use client';

import { useState } from 'react';

import { t } from '@/lib/i18n';
import { StoryBeat, Language } from '@/types';

import Button from '../common/Button';

import ChoiceButtons from './ChoiceButtons';
import ExportPdfButton from './ExportPdfButton';
import StoryCarousel from './StoryCarousel';
import StoryImage from './StoryImage';
import StoryText from './StoryText';

type EndViewMode = 'carousel' | 'fullText';

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
  const [endViewMode, setEndViewMode] = useState<EndViewMode>('carousel');

  const isStoryEnded = !isLoading && (!currentBeat?.choices || currentBeat.choices.length === 0);

  // Combine all story beats into one full story
  const getFullStory = () => {
    const allBeats = [...history];
    if (currentBeat) {
      allBeats.push(currentBeat);
    }
    return allBeats.map((beat) => beat.storyText).join(' ');
  };

  // Get full history including current beat for carousel
  const getFullHistory = () => {
    const allBeats = [...history];
    if (currentBeat) {
      allBeats.push(currentBeat);
    }
    return allBeats;
  };

  // Render the story end view with carousel or full text
  if (isStoryEnded) {
    return (
      <div className='relative min-h-screen w-full bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50'>
        {/* Header with player name and view toggle */}
        <div className='absolute right-4 top-4 z-10 flex flex-col items-end gap-2'>
          <div className='rounded-3xl bg-white/80 px-4 py-2 shadow-md backdrop-blur-sm'>
            <p className='text-sm font-medium text-purple-600'>{playerName}</p>
          </div>
          <div className='rounded-2xl bg-purple-500/90 px-3 py-1 shadow-md backdrop-blur-sm'>
            <p className='text-sm font-bold text-white'>{t('storyScreen.summary', language)}</p>
          </div>
        </div>

        {/* Main content area */}
        <div className='flex flex-col items-center px-4 py-8 pt-24'>
          {/* View toggle buttons */}
          <div className='mb-6 flex gap-2'>
            <Button
              onClick={() => setEndViewMode('carousel')}
              variant={endViewMode === 'carousel' ? 'primary' : 'outline'}
              className='px-4 py-2'
            >
              {t('storyScreen.galleryView', language)}
            </Button>
            <Button
              onClick={() => setEndViewMode('fullText')}
              variant={endViewMode === 'fullText' ? 'primary' : 'outline'}
              className='px-4 py-2'
            >
              {t('storyScreen.fullStory', language)}
            </Button>
          </div>

          {/* Carousel View */}
          {endViewMode === 'carousel' && (
            <div className='w-full max-w-4xl'>
              <StoryCarousel history={getFullHistory()} language={language} startAtEnd={true} />
            </div>
          )}

          {/* Full Text View */}
          {endViewMode === 'fullText' && (
            <div className='w-full max-w-4xl'>
              <StoryText
                text={getFullStory()}
                isLoading={isLoading}
                title={t('storyScreen.completeStory', language)}
                language={language}
              />
            </div>
          )}

          {/* End state actions */}
          <div className='mt-8 w-full max-w-md space-y-4'>
            {/* Export PDF Button */}
            <ExportPdfButton history={getFullHistory()} playerName={playerName} language={language} />

            {/* Restart and other options */}
            <ChoiceButtons
              choices={currentBeat?.choices}
              onChoice={onChoice}
              onRestart={onRestart}
              isLoading={isLoading}
              language={language}
            />
          </div>
        </div>
      </div>
    );
  }

  // Normal story view (not ended)
  return (
    <div className='relative flex min-h-screen w-full flex-col bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 md:flex-row md:items-center'>
      {/* Player Name and Page Display */}
      <div className='absolute right-4 top-4 z-10 flex flex-col items-end gap-2'>
        <div className='rounded-3xl bg-white/80 px-4 py-2 shadow-md backdrop-blur-sm'>
          <p className='text-sm font-medium text-purple-600'>{playerName}</p>
        </div>
        <div className='rounded-2xl bg-purple-500/90 px-3 py-1 shadow-md backdrop-blur-sm'>
          <p className='text-sm font-bold text-white'>
            {t('storyScreen.pageIndicator', language, { current: currentPage })}
          </p>
        </div>
      </div>

      {/* Left Side: Image */}
      <StoryImage imageUrl={currentBeat?.imageUrl} imagePrompt={currentBeat?.imagePrompt} isLoading={isLoading} />

      {/* Right Side: Story Text and Choices */}
      <div className='flex w-full flex-col p-4 md:w-1/2 md:p-6 lg:p-8 pt-0'>
        <StoryText text={currentBeat?.storyText} isLoading={isLoading} language={language} />
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
