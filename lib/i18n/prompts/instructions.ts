import { Language } from '@/types';

/**
 * Language-specific storytelling instructions for the LLM.
 * Defines the overall language style and rules for story generation.
 */
const languageInstructions: Record<Language, string> = {
  en: 'Tell story in a simple English suitable for kindergarten.',

  th: 'Tell the story in simple Thai language suitable for young children (เขียนเรื่องเป็นภาษาไทยง่ายๆ เหมาะสำหรับเด็กเล็ก).',

  singlish: `Tell the story in simple English with natural Singlish (Singapore English) expressions.
Use predominantly English but sprinkle in Singlish words and particles SUBTLY.
Common Singlish particles to use naturally: "lah" (emphasis), "leh" (softer/uncertain), "lor" (resignation), "meh" (questioning), "sia" (exclamation).
Common Singlish words: "wah" (wow), "shiok" (great/delicious), "alamak" (oh no), "steady" (reliable), "can" (yes).
Example: "Wah, the forest so magical lah! You want to explore, can?"
Keep it child-friendly and maintain story flow.`,
};

/**
 * Get language-specific storytelling instruction for the LLM system prompt.
 */
export function getLanguageInstruction(language: Language): string {
  return languageInstructions[language];
}
