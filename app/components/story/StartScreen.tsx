'use client';

import { Gender, Language } from '@/types';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';

interface StartScreenProps {
  nameInput: string;
  gender: Gender;
  language: Language;
  onNameChange: (name: string) => void;
  onGenderChange: (gender: Gender) => void;
  onLanguageChange: (language: Language) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function StartScreen({
  nameInput,
  gender,
  language,
  onNameChange,
  onGenderChange,
  onLanguageChange,
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
            {language === 'th' ? 'ชื่อของคุณคืออะไร นักสำรวจผู้กล้าหาญ?' : "What's your name, brave explorer?"}
          </p>

          <form onSubmit={onSubmit} className='space-y-4'>
            <Input
              id='name-input'
              label={language === 'th' ? 'ชื่อของคุณ' : 'Your name'}
              value={nameInput}
              onChange={onNameChange}
              placeholder={language === 'th' ? 'ใส่ชื่อของคุณ...' : 'Enter your name...'}
              autoFocus
            />

            {/* Gender Selection */}
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-purple-700'>
                {language === 'th' ? 'เพศ' : 'Gender'}
              </label>
              <div className='flex gap-3'>
                <button
                  type='button'
                  onClick={() => onGenderChange('boy')}
                  className={`flex-1 rounded-2xl border-2 px-4 py-3 text-lg font-medium transition-all ${
                    gender === 'boy'
                      ? 'border-blue-400 bg-blue-100 text-blue-700'
                      : 'border-purple-200 bg-white text-purple-600 hover:border-purple-300'
                  }`}
                >
                  {language === 'th' ? '👦 ด.ช.' : '👦 Boy'}
                </button>
                <button
                  type='button'
                  onClick={() => onGenderChange('girl')}
                  className={`flex-1 rounded-2xl border-2 px-4 py-3 text-lg font-medium transition-all ${
                    gender === 'girl'
                      ? 'border-pink-400 bg-pink-100 text-pink-700'
                      : 'border-purple-200 bg-white text-purple-600 hover:border-purple-300'
                  }`}
                >
                  {language === 'th' ? '👧 ด.ญ.' : '👧 Girl'}
                </button>
              </div>
            </div>

            {/* Language Selection */}
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-purple-700'>
                {language === 'th' ? 'ภาษา' : 'Language'}
              </label>
              <div className='flex gap-3'>
                <button
                  type='button'
                  onClick={() => onLanguageChange('en')}
                  className={`flex-1 rounded-2xl border-2 px-4 py-3 text-lg font-medium transition-all ${
                    language === 'en'
                      ? 'border-purple-400 bg-purple-100 text-purple-700'
                      : 'border-purple-200 bg-white text-purple-600 hover:border-purple-300'
                  }`}
                >
                  🇺🇸 English
                </button>
                <button
                  type='button'
                  onClick={() => onLanguageChange('th')}
                  className={`flex-1 rounded-2xl border-2 px-4 py-3 text-lg font-medium transition-all ${
                    language === 'th'
                      ? 'border-purple-400 bg-purple-100 text-purple-700'
                      : 'border-purple-200 bg-white text-purple-600 hover:border-purple-300'
                  }`}
                >
                  🇹🇭 ไทย
                </button>
              </div>
            </div>

            <Button
              type='submit'
              disabled={!nameInput.trim() || isLoading}
              fullWidth
            >
              {language === 'th' ? 'เริ่มการผจญภัย' : 'Start Adventure'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
