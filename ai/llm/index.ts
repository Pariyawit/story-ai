import { openai } from '../ai';
import { zodFunction } from 'openai/helpers/zod';
import { AIMessage } from '../types';

export const runLLM = async ({ messages }: { messages: AIMessage[] }) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.5,
    messages,
  });

  return response.choices[0].message;
};
