import Card from '../common/Card';
import LoadingSpinner from '../common/LoadingSpinner';

interface StoryTextProps {
  text?: string;
  isLoading: boolean;
}

export default function StoryText({ text, isLoading }: StoryTextProps) {
  return (
    <div className='overflow-y-auto'>
      <Card>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <p className='text-lg leading-relaxed text-purple-900'>
            {text || 'Your adventure begins...'}
          </p>
        )}
      </Card>
    </div>
  );
}
