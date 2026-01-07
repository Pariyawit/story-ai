import { Language } from '@/types';

/**
 * Initial transition texts shown when starting a new adventure.
 * These are displayed while the first story beat is being generated.
 */
const transitionTexts: Record<Language, (playerName: string) => string[]> = {
  en: (playerName: string) => [
    `🌟 Hello ${playerName}! Your adventure is about to begin...`,
    '📚 A magical book is opening its pages just for you...',
    '✨ A world of imagination awaits!',
    '🎭 Get ready for an exciting journey...',
  ],

  th: (playerName: string) => [
    `🌟 สวัสดี ${playerName}! การผจญภัยของเธอกำลังจะเริ่มต้น...`,
    '📚 หนังสือวิเศษกำลังเปิดหน้าใหม่ให้เธอ...',
    '✨ โลกแห่งจินตนาการกำลังรอเธออยู่!',
    '🎭 เตรียมพร้อมสำหรับการเดินทางที่น่าตื่นเต้น...',
  ],

  singlish: (playerName: string) => [
    `🌟 Wah, hello ${playerName}! Your adventure starting already lah...`,
    '📚 A magic book opening just for you leh...',
    '✨ A world of imagination waiting for you sia!',
    '🎭 Get ready for one shiok journey...',
  ],
};

/**
 * Get initial transition texts for the specified language and player name.
 */
export function getInitialTransitionTexts(playerName: string, language: Language): string[] {
  return transitionTexts[language](playerName);
}
