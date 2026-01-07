'use client';

import Image from 'next/image';
import { useState } from 'react';

import { t } from '@/lib/i18n';
import { StoryBeat, Language } from '@/types';

interface StoryCarouselProps {
  history: StoryBeat[];
  language: Language;
  startAtEnd?: boolean;
}

export default function StoryCarousel({ history, language, startAtEnd = false }: StoryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(startAtEnd && history.length > 0 ? history.length - 1 : 0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? history.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === history.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (history.length === 0) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <p className='text-lg text-gray-500'>{t('carousel.noStory', language)}</p>
      </div>
    );
  }

  const currentBeat = history[currentIndex];

  return (
    <div className='flex w-full flex-col items-center gap-6'>
      {/* Page indicator */}
      <div className='rounded-full bg-purple-500/90 px-4 py-2 shadow-md'>
        <p className='text-sm font-bold text-white'>
          {t('carousel.sceneIndicator', language, { current: currentIndex + 1, total: history.length })}
        </p>
      </div>

      {/* Main carousel container */}
      <div className='relative w-full max-w-4xl'>
        {/* Navigation arrows */}
        <button
          onClick={goToPrevious}
          className='absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-3 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white'
          aria-label='Previous'
        >
          <svg className='h-6 w-6 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
          </svg>
        </button>

        <button
          onClick={goToNext}
          className='absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-3 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white'
          aria-label='Next'
        >
          <svg className='h-6 w-6 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
          </svg>
        </button>

        {/* Image container */}
        <div className='overflow-hidden rounded-3xl bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 shadow-2xl'>
          <div className='relative aspect-[16/10] w-full'>
            {currentBeat.imageUrl ? (
              <Image
                src={currentBeat.imageUrl}
                alt={currentBeat.imagePrompt || `Scene ${currentIndex + 1}`}
                fill
                className='object-cover transition-opacity duration-300'
                sizes='(max-width: 768px) 100vw, 800px'
                priority
              />
            ) : (
              <div className='flex h-full w-full items-center justify-center'>
                <p className='text-xl text-purple-700'>{t('carousel.noImage', language)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Story text for current scene */}
        <div className='mt-6 rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm'>
          <p className='text-lg leading-relaxed text-gray-800'>{currentBeat.storyText}</p>
          {currentBeat.selected && (
            <div className='mt-4 flex items-center gap-2'>
              <span className='text-purple-500'>▸</span>
              <span className='text-sm italic text-purple-600'>
                {t('carousel.youChose', language)} {currentBeat.selected}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Dot indicators */}
      <div className='flex flex-wrap justify-center gap-2'>
        {history.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 w-3 rounded-full transition-all ${
              index === currentIndex ? 'scale-125 bg-purple-500' : 'bg-purple-200 hover:bg-purple-300'
            }`}
            aria-label={`Go to scene ${index + 1}`}
          />
        ))}
      </div>

      {/* Keyboard navigation hint */}
      <p className='text-sm text-gray-400'>{t('carousel.navHint', language)}</p>
    </div>
  );
}
