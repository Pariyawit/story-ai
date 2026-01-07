import { Language } from '@/types';

/**
 * Base choice rules that apply to all languages
 */
const baseChoiceRules = `
        - NEVER use generic placeholders like "Choice A", "Choice B", "Choice C"
        - Choices must relate directly to the current story scene
        - Use simple, exciting verbs that children understand
        - For each choice, provide 3-4 short transition sentences that describe what happens when the child picks that choice
        - Transition sentences should build excitement and bridge to the next scene`;

/**
 * Language-specific choice formatting rules
 */
const languageSpecificRules: Record<Language, string> = {
  en: `CHOICE RULES:
        - Each choice MUST be written in simple English
        - Each choice MUST be a specific, actionable option for the child (e.g., "Follow the butterfly", "Open the magic door", "Talk to the friendly owl")${baseChoiceRules}`,

  th: `CHOICE RULES:
        - Each choice MUST be written in simple Thai language (ภาษาไทยง่ายๆ)
        - Each choice MUST be a specific, actionable option for the child (e.g., "ตามผีเสื้อไป", "เปิดประตูวิเศษ", "คุยกับนกฮูก")${baseChoiceRules}`,

  singlish: `CHOICE RULES:
        - Each choice MUST be written primarily in English with subtle Singlish expressions
        - Each choice MUST be a specific, actionable option (e.g., "Follow the butterfly lah", "Wah, let's open the door", "Talk to the owl lor")
        - Add Singlish particles (lah, leh, lor) naturally - not in every choice, keep it subtle${baseChoiceRules}`,
};

/**
 * Get choice formatting rules for the specified language.
 */
export function getChoiceRules(language: Language): string {
  return languageSpecificRules[language];
}
