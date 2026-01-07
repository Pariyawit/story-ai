'use client';

import { useState } from 'react';

import { t, TranslationKey } from '@/lib/i18n';
import { Gender, Language, StoryTheme, CharacterCustomization } from '@/types';

import Button from '../common/Button';
import Card from '../common/Card';
import Input from '../common/Input';

import CharacterWizard from './CharacterWizard';

// Theme configuration with translation keys
const THEMES: { id: StoryTheme; emoji: string; labelKey: TranslationKey }[] = [
  { id: 'enchanted_forest', emoji: '🌳', labelKey: 'theme.enchantedForest' },
  { id: 'space_adventure', emoji: '🚀', labelKey: 'theme.spaceAdventure' },
  { id: 'underwater_kingdom', emoji: '🌊', labelKey: 'theme.underwaterKingdom' },
  { id: 'dinosaur_land', emoji: '🦕', labelKey: 'theme.dinosaurLand' },
  { id: 'fairy_tale_castle', emoji: '🏰', labelKey: 'theme.fairyTaleCastle' },
];

interface StartScreenProps {
  nameInput: string;
  gender: Gender;
  language: Language;
  theme: StoryTheme;
  character: CharacterCustomization;
  onNameChange: (name: string) => void;
  onGenderChange: (gender: Gender) => void;
  onLanguageChange: (language: Language) => void;
  onThemeChange: (theme: StoryTheme) => void;
  onCharacterChange: (character: CharacterCustomization) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function StartScreen({
  nameInput,
  gender,
  language,
  theme,
  character,
  onNameChange,
  onGenderChange,
  onLanguageChange,
  onThemeChange,
  onCharacterChange,
  onSubmit,
  isLoading = false,
}: StartScreenProps) {
  const [isThemeExpanded, setIsThemeExpanded] = useState(false);
  const [isCharacterExpanded, setIsCharacterExpanded] = useState(false);

  const selectedTheme = THEMES.find((t) => t.id === theme) || THEMES[0];

  return (
    <div className='flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100'>
      <div className='w-full max-w-md px-8'>
        <Card className='p-8 shadow-lg'>
          <h1 className='mb-6 text-center text-4xl font-bold text-purple-600'>Story Adventure</h1>
          <p className='mb-8 text-center text-lg text-purple-500'>{t('startScreen.subtitle', language)}</p>

          <form onSubmit={onSubmit} className='space-y-4'>
            <Input
              id='name-input'
              label={t('startScreen.nameLabel', language)}
              value={nameInput}
              onChange={onNameChange}
              placeholder={t('startScreen.namePlaceholder', language)}
              autoFocus
            />

            <div className='space-y-2'>
              <label className='block text-sm font-medium text-purple-700'>
                {t('startScreen.genderLabel', language)}
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
                  {t('startScreen.genderBoy', language)}
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
                  {t('startScreen.genderGirl', language)}
                </button>
              </div>
            </div>

            <div className='space-y-2'>
              <label className='block text-sm font-medium text-purple-700'>
                {t('startScreen.languageLabel', language)}
              </label>
              <div className='grid grid-cols-3 gap-2'>
                <button
                  type='button'
                  onClick={() => onLanguageChange('en')}
                  className={`rounded-2xl border-2 px-3 py-3 text-sm font-medium transition-all ${
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
                  className={`rounded-2xl border-2 px-3 py-3 text-sm font-medium transition-all ${
                    language === 'th'
                      ? 'border-purple-400 bg-purple-100 text-purple-700'
                      : 'border-purple-200 bg-white text-purple-600 hover:border-purple-300'
                  }`}
                >
                  🇹🇭 ไทย
                </button>
                <button
                  type='button'
                  onClick={() => onLanguageChange('singlish')}
                  className={`rounded-2xl border-2 px-3 py-3 text-sm font-medium transition-all ${
                    language === 'singlish'
                      ? 'border-purple-400 bg-purple-100 text-purple-700'
                      : 'border-purple-200 bg-white text-purple-600 hover:border-purple-300'
                  }`}
                >
                  🇸🇬 Singlish
                </button>
              </div>
            </div>

            {/* Character Customization - Collapsible */}
            <div className='space-y-2'>
              <button
                type='button'
                onClick={() => setIsCharacterExpanded(!isCharacterExpanded)}
                className='flex w-full items-center justify-between rounded-2xl border-2 border-purple-200 bg-white px-4 py-3 text-left transition-all hover:border-purple-300'
              >
                <span className='text-sm font-medium text-purple-700'>
                  {t('startScreen.characterDesign', language)}
                </span>
                <span className='flex items-center gap-2 text-purple-600'>
                  <span className='text-lg'>✨ 🎨</span>
                  <span className={`text-lg transition-transform ${isCharacterExpanded ? 'rotate-180' : ''}`}>▼</span>
                </span>
              </button>

              {isCharacterExpanded && (
                <div className='rounded-2xl border-2 border-purple-100 bg-white/50 p-4'>
                  <CharacterWizard
                    character={character}
                    gender={gender}
                    language={language}
                    onChange={onCharacterChange}
                  />
                </div>
              )}
            </div>

            {/* Theme Selection - Collapsible */}
            <div className='space-y-2'>
              <button
                type='button'
                onClick={() => setIsThemeExpanded(!isThemeExpanded)}
                className='flex w-full items-center justify-between rounded-2xl border-2 border-purple-200 bg-white px-4 py-3 text-left transition-all hover:border-purple-300'
              >
                <span className='text-sm font-medium text-purple-700'>{t('startScreen.storyWorld', language)}</span>
                <span className='flex items-center gap-2 text-purple-600'>
                  <span className='text-xl'>{selectedTheme.emoji}</span>
                  <span className='text-sm font-medium'>{t(selectedTheme.labelKey, language)}</span>
                  <span className={`text-lg transition-transform ${isThemeExpanded ? 'rotate-180' : ''}`}>▼</span>
                </span>
              </button>

              {isThemeExpanded && (
                <div className='grid grid-cols-2 gap-2 pt-2 md:grid-cols-3'>
                  {THEMES.map(({ id, emoji, labelKey }) => (
                    <button
                      key={id}
                      type='button'
                      onClick={() => {
                        onThemeChange(id);
                        setIsThemeExpanded(false);
                      }}
                      className={`rounded-2xl border-2 p-3 text-center transition-all ${
                        theme === id
                          ? 'border-purple-400 bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700 shadow-md'
                          : 'border-purple-200 bg-white text-purple-600 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      <span className='text-2xl'>{emoji}</span>
                      <p className='mt-1 text-xs font-medium'>{t(labelKey, language)}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button type='submit' disabled={!nameInput.trim() || isLoading} fullWidth>
              {t('startScreen.startAdventure', language)}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
