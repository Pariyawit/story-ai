import Button from '../common/Button';

interface ChoiceButtonsProps {
  choices?: string[];
  onChoice: (choice: string) => void;
  isLoading: boolean;
}

export default function ChoiceButtons({
  choices,
  onChoice,
  isLoading,
}: ChoiceButtonsProps) {
  const gradientColors = [
    'from-pink-300 to-rose-300 hover:from-pink-400 hover:to-rose-400',
    'from-blue-300 to-cyan-300 hover:from-blue-400 hover:to-cyan-400',
    'from-purple-300 to-violet-300 hover:from-purple-400 hover:to-violet-400',
  ];

  if (!choices || choices.length === 0) {
    return null;
  }

  return (
    <div className='mt-4 flex w-full flex-shrink-0 items-center justify-center'>
      <div className='w-full space-y-4'>
        {choices.map((choice, index) => (
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
