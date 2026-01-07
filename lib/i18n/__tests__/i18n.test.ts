import { describe, it, expect } from 'vitest';

import { t, createTranslator } from '../index';

describe('i18n', () => {
  describe('t()', () => {
    it('returns English translation for en language', () => {
      expect(t('choiceButtons.congratsTitle', 'en')).toBe('Congratulations, Brave Adventurer!');
    });

    it('returns Thai translation for th language', () => {
      expect(t('choiceButtons.congratsTitle', 'th')).toBe('ยินดีด้วย นักผจญภัยผู้กล้าหาญ!');
    });

    it('returns Singlish translation for singlish language', () => {
      expect(t('choiceButtons.congratsTitle', 'singlish')).toBe('Wah, Congrats, Brave Adventurer!');
    });

    it('interpolates string parameters correctly', () => {
      expect(t('pdf.creditText', 'en', { name: 'Alex' })).toBe('Created by Alex');
      expect(t('pdf.creditText', 'th', { name: 'สมชาย' })).toBe('สร้างสรรค์โดย สมชาย');
      expect(t('pdf.creditText', 'singlish', { name: 'Ah Boy' })).toBe('Created by Ah Boy one');
    });

    it('interpolates number parameters correctly', () => {
      expect(t('storyScreen.pageIndicator', 'en', { current: 3 })).toBe('Page 3/12');
      expect(t('storyScreen.pageIndicator', 'th', { current: 5 })).toBe('หน้า 5/12');
    });

    it('interpolates multiple parameters correctly', () => {
      expect(t('carousel.sceneIndicator', 'en', { current: 2, total: 10 })).toBe('Scene 2 / 10');
      expect(t('carousel.sceneIndicator', 'th', { current: 3, total: 12 })).toBe('ฉาก 3 / 12');
    });

    it('returns translation without modification when no params provided', () => {
      expect(t('transition.loading', 'en')).toBe('✨ Magic is happening... ✨');
      expect(t('transition.loading', 'singlish')).toBe('✨ Magic happening sia... ✨');
    });

    it('handles all theme translations', () => {
      expect(t('theme.enchantedForest', 'en')).toBe('Enchanted Forest');
      expect(t('theme.enchantedForest', 'th')).toBe('ป่าวิเศษ');
      expect(t('theme.spaceAdventure', 'en')).toBe('Space Adventure');
      expect(t('theme.dinosaurLand', 'th')).toBe('ดินแดนไดโนเสาร์');
    });

    it('handles character option translations', () => {
      expect(t('hairColor.brown', 'en')).toBe('Brown');
      expect(t('hairColor.brown', 'th')).toBe('น้ำตาล');
      expect(t('outfit.wizard', 'en')).toBe('Wizard');
      expect(t('outfit.wizard', 'th')).toBe('พ่อมด/แม่มด');
    });
  });

  describe('createTranslator()', () => {
    it('creates a bound translator for English', () => {
      const translate = createTranslator('en');
      expect(translate('speak.listen')).toBe('🔊 Listen');
      expect(translate('speak.stop')).toBe('🔇 Stop');
    });

    it('creates a bound translator for Thai', () => {
      const translate = createTranslator('th');
      expect(translate('speak.listen')).toBe('🔊 ฟัง');
      expect(translate('speak.stop')).toBe('🔇 หยุด');
    });

    it('creates a bound translator for Singlish', () => {
      const translate = createTranslator('singlish');
      expect(translate('speak.listen')).toBe('🔊 Listen leh');
      expect(translate('speak.stop')).toBe('🔇 Stop lah');
    });

    it('supports interpolation with bound translator', () => {
      const translate = createTranslator('en');
      expect(translate('pdf.sceneLabel', { index: 5 })).toBe('Scene 5');
    });
  });

  describe('locale completeness', () => {
    it('all locales have the same keys', async () => {
      // Import locales directly to check
      const { en, th, singlish } = await import('../locales');

      const enKeys = Object.keys(en).sort();
      const thKeys = Object.keys(th).sort();
      const singlishKeys = Object.keys(singlish).sort();

      expect(thKeys).toEqual(enKeys);
      expect(singlishKeys).toEqual(enKeys);
    });
  });
});
