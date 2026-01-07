import { Language } from '@/types';

/**
 * Language-specific JSON format examples for LLM responses.
 * Shows the expected structure with appropriate language examples.
 */
const jsonExamples: Record<Language, string> = {
  en: `STRICT JSON FORMAT:
        You must respond ONLY with this JSON structure. No prose before or after.
        {
          "storyText": "The text of the current story step.",
          "choices": ["Follow the butterfly", "Open the magic door", "Talk to the friendly owl"],
          "choicesWithTransition": [
            {"text": "Follow the butterfly", "transition": ["You chase the rainbow butterfly...", "Its wings shimmer with magic...", "It leads you to a secret garden..."]},
            {"text": "Open the magic door", "transition": ["You turn the golden doorknob...", "Bright light bursts through...", "A wonderful land appears..."]},
            {"text": "Talk to the friendly owl", "transition": ["You walk up to the wise owl...", "Its big eyes sparkle...", "It whispers a secret..."]}
          ],
          "imagePrompt": "The detailed prompt for this specific scene."
        }`,

  th: `STRICT JSON FORMAT:
        You must respond ONLY with this JSON structure. No prose before or after.
        {
          "storyText": "ข้อความของเรื่องในขั้นตอนปัจจุบัน (ภาษาไทย)",
          "choices": ["ตามผีเสื้อไป", "เปิดประตูวิเศษ", "คุยกับนกฮูกใจดี"],
          "choicesWithTransition": [
            {"text": "ตามผีเสื้อไป", "transition": ["เธอวิ่งตามผีเสื้อสีรุ้ง...", "ปีกของมันเปล่งแสงวิเศษ...", "มันพาเธอไปยังสวนลับ..."]},
            {"text": "เปิดประตูวิเศษ", "transition": ["เธอหมุนลูกบิดประตู...", "แสงสว่างวาบออกมา...", "ดินแดนมหัศจรรย์ปรากฏ..."]},
            {"text": "คุยกับนกฮูกใจดี", "transition": ["เธอเดินเข้าไปหานกฮูก...", "ตาโตของมันเป็นประกาย...", "มันกระซิบความลับ..."]}
          ],
          "imagePrompt": "The detailed prompt for this specific scene (in English for image generation)."
        }`,

  singlish: `STRICT JSON FORMAT:
        You must respond ONLY with this JSON structure. No prose before or after.
        {
          "storyText": "Wah, the forest so magical lah! The trees all sparkling one. You see something shiny behind the bushes.",
          "choices": ["Follow the butterfly lah", "Wah open the magic door", "Talk to the owl lor"],
          "choicesWithTransition": [
            {"text": "Follow the butterfly lah", "transition": ["You chase the pretty butterfly...", "Wah its wings so shiok! Got sparkles one...", "It brings you to a secret garden..."]},
            {"text": "Wah open the magic door", "transition": ["You turn the doorknob slowly leh...", "Alamak! Bright light everywhere...", "A wonderful land appears sia!"]},
            {"text": "Talk to the owl lor", "transition": ["You walk up to the owl...", "Its big eyes look at you...", "The owl whispers a secret leh..."]}
          ],
          "imagePrompt": "The detailed prompt for this specific scene (in English for image generation)."
        }`,
};

/**
 * Get JSON format example for the specified language.
 */
export function getJsonFormatExample(language: Language): string {
  return jsonExamples[language];
}
