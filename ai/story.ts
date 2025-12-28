import { StoryBeat } from '@/types';
import systemPrompt from './llm/systemPrompt';
import { AIMessage } from './types';
import { runLLM } from './llm';
import { generateImage } from './generateImage';

// act as if it is store in some db
const mapHistory = (name: string, history: StoryBeat[]): AIMessage[] => {
  const messages: AIMessage[] = [systemPrompt(name)];
  console.log('mapHistory');
  console.log(history);
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

export const runStory = async (name: string, history: StoryBeat[]) => {
  // map history to llm message
  const result = await runLLM({ messages: mapHistory(name, history) });
  console.log(result.content);
  if (!result.content) {
    return null;
  }
  const content = JSON.parse(result.content);
  console.log({ content });
  if (content.imagePrompt) {
    const imageUrl = await generateImage({ prompt: content.imagePrompt });
    return { ...content, imageUrl };
  }
  return content;
};
