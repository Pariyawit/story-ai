import { Language } from '@/types';

import Card from '../common/Card';
import LoadingSpinner from '../common/LoadingSpinner';
import SpeakButton from '../common/SpeakButton';

interface StoryTextProps {
  text?: string;
  isLoading: boolean;
  title?: string;
  language?: Language;
}

export default function StoryText({ text, isLoading, title, language = 'en' }: StoryTextProps) {
  return (
    <div className='overflow-y-auto'>
      <Card>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div>
            {title && <h2 className='mb-4 text-xl font-bold text-purple-700'>{title}</h2>}
            <p className='text-lg leading-relaxed text-purple-900'>{text || 'Your adventure begins...'}</p>
            {text && (
              <div className='mt-4 flex justify-end'>
                <SpeakButton text={text} language={language} />
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
