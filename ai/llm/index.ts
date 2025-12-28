import { openai } from '../ai';
import { zodFunction } from 'openai/helpers/zod';
import { AIMessage } from '../types';

export const runLLM = async ({ messages }: { messages: AIMessage[] }) => {
  console.log(messages);
  const response = await openai.chat.completions.create({
    model: 'gpt-5-mini',
    // temperature: 0.8,
    messages,
  });

  return response.choices[0].message;
};
