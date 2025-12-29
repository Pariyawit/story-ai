import { StoryBeat, Gender, Language } from '@/types';
import systemPrompt from './llm/systemPrompt';
import { AIMessage } from './types';
import { runLLM } from './llm';
import { generateImage } from './generateImage';

// Patterns that indicate placeholder/hallucinated choices
const PLACEHOLDER_PATTERNS = [
  /^choice\s*[a-c]$/i,
  /^option\s*[a-c]$/i,
  /^choice\s*\d+$/i,
  /^option\s*\d+$/i,
  /^alternative\s*[a-c]$/i,
  /^pick\s*[a-c]$/i,
  /^\d+\.\s*choice\s*[a-c]$/i,
  /^[a-c]\.?\s*$/i,
];

// Check if a choice looks like a placeholder
const isPlaceholderChoice = (choice: string): boolean => {
  const trimmed = choice.trim();
  return PLACEHOLDER_PATTERNS.some(pattern => pattern.test(trimmed));
};

// Validate choices for placeholder patterns. Returns true if choices are valid.
const validateChoices = (choices: string[] | undefined): boolean => {
  if (!choices || !Array.isArray(choices)) return true;
  
  const placeholderChoices = choices.filter(isPlaceholderChoice);
  if (placeholderChoices.length > 0) {
    console.warn(
      '[WARN] Detected placeholder choices that may indicate LLM hallucination:',
      placeholderChoices
    );
    return false;
  }
  return true;
};

// act as if it is store in some db
const mapHistory = (name: string, history: StoryBeat[], gender: Gender, language: Language): AIMessage[] => {
  const messages: AIMessage[] = [systemPrompt(name, gender, language)];

  history.forEach((storyBeat, index) => {
    const { storyText, choices, selected, imagePrompt, imageUrl } = storyBeat;

    messages.push({
      role: 'assistant',
      content: JSON.stringify({ storyText, choices, imagePrompt, imageUrl }),
    });

    if (selected) {
      messages.push({
        role: 'user',
        content: JSON.stringify({ selected, beat: index + 1 }),
      });
    }
  });
  return messages;
};

const ENABLE_IMAGE_GENERATION = process.env.ENABLE_IMAGE_GENERATION !== 'false';

export const runStory = async (name: string, history: StoryBeat[], gender: Gender, language: Language) => {
  const startTime = Date.now();

  // map history to llm message
  console.log('[PERF] Starting LLM call...');
  const llmStart = Date.now();
  const result = await runLLM({ messages: mapHistory(name, history, gender, language) });
  const llmDuration = Date.now() - llmStart;
  console.log(`[PERF] LLM completed in ${llmDuration}ms`);

  if (!result.content) {
    return null;
  }
  const content = JSON.parse(result.content);
  console.log(content);

  // Validate choices for placeholder patterns
  const choicesValid = validateChoices(content.choices);
  if (!choicesValid) {
    console.warn('[WARN] Proceeding with potentially invalid choices');
  }

  // Generate image if enabled and prompt exists
  if (ENABLE_IMAGE_GENERATION && content.imagePrompt) {
    try {
      console.log('[PERF] Starting image generation...');
      const imageStart = Date.now();
      const imageUrl = await generateImage({ prompt: content.imagePrompt });
      const imageDuration = Date.now() - imageStart;
      console.log(`[PERF] Image generation completed in ${imageDuration}ms`);

      const totalDuration = Date.now() - startTime;
      console.log(`[PERF] Total runStory duration: ${totalDuration}ms (LLM: ${llmDuration}ms, Image: ${imageDuration}ms)`);

      return { ...content, imageUrl };
    } catch (error) {
      console.error(
        'Image generation failed, continuing without image:',
        error
      );
      return { ...content, imageUrl: undefined };
    }
  }

  const totalDuration = Date.now() - startTime;
  console.log(`[PERF] Total runStory duration: ${totalDuration}ms (LLM: ${llmDuration}ms, Image: disabled)`);

  return { ...content, imageUrl: undefined };
};
