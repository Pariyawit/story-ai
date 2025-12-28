import { StoryBeat } from '@/types';
import systemPrompt from './llm/systemPrompt';
import { AIMessage } from './types';
import { runLLM } from './llm';
import { generateImage } from './generateImage';

// act as if it is store in some db
const mapHistory = (name: string, history: StoryBeat[]): AIMessage[] => {
  const messages: AIMessage[] = [systemPrompt(name)];

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

export const runStory = async (name: string, history: StoryBeat[]) => {
  const startTime = Date.now();

  // map history to llm message
  console.log('[PERF] Starting LLM call...');
  const llmStart = Date.now();
  const result = await runLLM({ messages: mapHistory(name, history) });
  const llmDuration = Date.now() - llmStart;
  console.log(`[PERF] LLM completed in ${llmDuration}ms`);

  if (!result.content) {
    return null;
  }
  const content = JSON.parse(result.content);
  console.log(content);

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
