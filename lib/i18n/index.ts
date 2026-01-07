import { Language } from '@/types';

import { en, th, singlish } from './locales';
import { TranslationKey, InterpolationParams, Translations } from './types';

/**
 * All available locales mapped by language code
 */
const locales: Record<Language, Translations> = {
  en,
  th,
  singlish,
};

/**
 * Main translation function.
 *
 * @param key - The translation key (type-safe)
 * @param language - The target language
 * @param params - Optional interpolation parameters e.g., { name: "Alex", count: 5 }
 * @returns The translated string with interpolated values
 *
 * @example
 * // Simple usage
 * t('choiceButtons.congratsTitle', 'en')
 * // => "Congratulations, Brave Adventurer!"
 *
 * @example
 * // With interpolation
 * t('pdf.creditText', 'en', { name: 'Alex' })
 * // => "Created by Alex"
 *
 * @example
 * // With number interpolation
 * t('storyScreen.pageIndicator', 'th', { current: 3 })
 * // => "หน้า 3/12"
 */
export function t(key: TranslationKey, language: Language, params?: InterpolationParams): string {
  // Get translation from the requested language, fallback to English
  const translation = locales[language]?.[key] ?? locales['en'][key] ?? key;

  // If no params, return as-is
  if (!params) return translation;

  // Interpolate {{param}} placeholders with actual values
  return Object.entries(params).reduce(
    (str, [param, value]) => str.replace(new RegExp(`\\{\\{${param}\\}\\}`, 'g'), String(value)),
    translation
  );
}

/**
 * Create a translator function bound to a specific language.
 * Useful when you have many translations with the same language.
 *
 * @param language - The language to bind
 * @returns A translation function that only requires key and optional params
 *
 * @example
 * const translate = createTranslator('th');
 * translate('choiceButtons.congratsTitle')
 * // => "ยินดีด้วย นักผจญภัยผู้กล้าหาญ!"
 */
export function createTranslator(language: Language) {
  return (key: TranslationKey, params?: InterpolationParams) => t(key, language, params);
}

// Re-export types for convenience
export type { TranslationKey, Translations, InterpolationParams };
