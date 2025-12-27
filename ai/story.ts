import { StoryBeat } from '@/types';
import systemPrompt from './llm/systemPrompt';
import { AIMessage } from './types';
import { runLLM } from './llm';
import { generateImage } from './generateImage';

// act as if it is store in some db
const mapHistory = (history: StoryBeat[]): AIMessage[] => {
  const messages: AIMessage[] = [systemPrompt];
  history.forEach((storyBeat) => {
    const { storyText, choices, selected } = storyBeat;

    messages.push({
      role: 'assistant',
      content: JSON.stringify({ storyText, choices }),
    });

    if (selected) {
      messages.push({
        role: 'user',
        content: JSON.stringify(selected),
      });
    }
  });
  return messages;
};

export const runStory = async (name: string, history: StoryBeat[]) => {
  // map history to llm message
  const result = await runLLM({ messages: mapHistory(history) });
  console.log(result.content);
  if (!result.content) {
    return null;
  }
  const content = JSON.parse(result.content);
  const imagePrompt = result.content;
  if (imagePrompt) {
    const imageUrl = await generateImage({ prompt: imagePrompt });
    return { ...content, imageUrl };
  }
  return content;
};
