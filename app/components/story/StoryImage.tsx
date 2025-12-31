import Image from 'next/image';

interface StoryImageProps {
  imageUrl?: string;
  imagePrompt?: string;
  isLoading: boolean;
}

export default function StoryImage({ imageUrl, imagePrompt, isLoading }: StoryImageProps) {
  return (
    <div className='w-full p-4 md:w-1/2 md:p-6 lg:p-8'>
      <div className='flex items-center justify-center'>
        <div className='w-full max-w-2xl md:max-w-none'>
          <div className='relative aspect-square w-full overflow-hidden rounded-3xl bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 shadow-lg'>
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={imagePrompt || 'Story scene'}
                fill
                className='object-cover'
                sizes='(max-width: 768px) 100vw, 50vw'
                priority
              />
            ) : (
              <div className='flex h-full w-full items-center justify-center p-8 text-center'>
                <p className='text-xl font-medium text-purple-700'>
                  {isLoading ? 'Generating story...' : 'No image available'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
