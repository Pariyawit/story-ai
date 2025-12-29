import Card from '../common/Card';
import LoadingSpinner from '../common/LoadingSpinner';

interface StoryTextProps {
  text?: string;
  isLoading: boolean;
  title?: string;
}

export default function StoryText({ text, isLoading, title }: StoryTextProps) {
  return (
    <div className='overflow-y-auto'>
      <Card>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div>
            {title && (
              <h2 className='mb-4 text-xl font-bold text-purple-700'>{title}</h2>
            )}
            <p className='text-lg leading-relaxed text-purple-900'>
              {text || 'Your adventure begins...'}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
