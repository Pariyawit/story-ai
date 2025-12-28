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
  // map history to llm message
  const result = await runLLM({ messages: mapHistory(name, history) });

  if (!result.content) {
    return null;
  }
  const content = JSON.parse(result.content);
  console.log(content);
  // Generate image if enabled and prompt exists
  if (ENABLE_IMAGE_GENERATION && content.imagePrompt) {
    try {
      const imageUrl = await generateImage({ prompt: content.imagePrompt });
      return { ...content, imageUrl };
    } catch (error) {
      console.error(
        'Image generation failed, continuing without image:',
        error
      );
      return { ...content, imageUrl: undefined };
    }
  }

  return { ...content, imageUrl: undefined };
};
