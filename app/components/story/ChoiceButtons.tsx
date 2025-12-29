'use client';

import { useRouter } from 'next/navigation';
import { Language, StoryBeat } from '@/types';
import Button from '../common/Button';

interface ChoiceButtonsProps {
  choices?: string[];
  onChoice: (choice: string) => void;
  onRestart: () => void;
  isLoading: boolean;
  language?: Language;
  history?: StoryBeat[];
  currentBeat?: StoryBeat | null;
}

export default function ChoiceButtons({
  choices,
  onChoice,
  onRestart,
  isLoading,
  language = 'en',
  history = [],
  currentBeat,
}: ChoiceButtonsProps) {
  const router = useRouter();
  const isStoryEnded = !isLoading && (!choices || choices.length === 0);

  const handleViewGallery = () => {
    // Combine history with current beat for full story
    const fullHistory = currentBeat ? [...history, currentBeat] : history;

    // Save to localStorage for gallery page to read
    localStorage.setItem('story-gallery-history', JSON.stringify(fullHistory));
    localStorage.setItem('story-gallery-language', language);

    // Navigate to gallery
    router.push('/gallery');
  };

  const gradientColors = [
    'from-pink-300 to-rose-300 hover:from-pink-400 hover:to-rose-400',
    'from-blue-300 to-cyan-300 hover:from-blue-400 hover:to-cyan-400',
    'from-purple-300 to-violet-300 hover:from-purple-400 hover:to-violet-400',
  ];

  return (
    <div className='mt-4 flex w-full flex-shrink-0 items-center justify-center'>
      <div className='w-full space-y-4'>
        {/* END STATE: Show celebration + restart button */}
        {isStoryEnded && (
          <div className='space-y-6'>
            <div className='space-y-2 text-center'>
              <div className='text-6xl'>🎉✨🌟</div>
              <h2 className='text-2xl font-bold text-purple-600'>
                {language === 'th' ? 'ยินดีด้วย นักผจญภัยผู้กล้าหาญ!' : 'Congratulations, Brave Adventurer!'}
              </h2>
              <p className='text-lg text-purple-500'>
                {language === 'th' ? 'คุณได้เสร็จสิ้นการเดินทางมหัศจรรย์แล้ว!' : "You've completed your magical journey!"}
              </p>
            </div>

            {/* View Gallery Button */}
            <Button
              onClick={handleViewGallery}
              disabled={isLoading || history.length === 0}
              variant='gradient'
              gradientColors='from-amber-300 to-orange-300 hover:from-amber-400 hover:to-orange-400'
              fullWidth
              className='py-4 text-lg'
            >
              {language === 'th' ? '🎨 ดูแกลเลอรีการผจญภัย' : '🎨 View Adventure Gallery'}
            </Button>

            <Button
              onClick={onRestart}
              disabled={isLoading}
              variant='primary'
              fullWidth
              className='py-4 text-lg'
            >
              {language === 'th' ? 'จบเรื่อง - เริ่มการผจญภัยใหม่' : 'The End - Start New Adventure'}
            </Button>
          </div>
        )}

        {/* NORMAL STATE: Show choice buttons */}
        {!isStoryEnded &&
          choices &&
          choices.map((choice, index) => (
            <Button
              key={index}
              onClick={() => onChoice(choice)}
              disabled={isLoading}
              variant='gradient'
              gradientColors={gradientColors[index % gradientColors.length]}
              fullWidth
            >
              {choice}
            </Button>
          ))}
      </div>
    </div>
  );
}
