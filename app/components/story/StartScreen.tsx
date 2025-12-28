'use client';

import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';

interface StartScreenProps {
  nameInput: string;
  onNameChange: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function StartScreen({
  nameInput,
  onNameChange,
  onSubmit,
  isLoading = false,
}: StartScreenProps) {
  return (
    <div className='flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100'>
      <div className='w-full max-w-md px-8'>
        <Card className='p-8 shadow-lg'>
          <h1 className='mb-6 text-center text-4xl font-bold text-purple-600'>
            Story Adventure
          </h1>
          <p className='mb-8 text-center text-lg text-purple-500'>
            What&apos;s your name, brave explorer?
          </p>

          <form onSubmit={onSubmit} className='space-y-4'>
            <Input
              id='name-input'
              label='Your name'
              value={nameInput}
              onChange={onNameChange}
              placeholder='Enter your name...'
              autoFocus
            />

            <Button
              type='submit'
              disabled={!nameInput.trim() || isLoading}
              fullWidth
            >
              Start Adventure
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
