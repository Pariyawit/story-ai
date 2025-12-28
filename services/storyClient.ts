import { StoryBeat } from '@/types';

export async function postStory(name: string, history: StoryBeat[]) {
  const response = await fetch('/api/story', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, history }),
  });

  if (!response.ok) throw new Error('Failed to get next story beat');

  // if response has no choice = end
  return response.json();
  // Expecting: { text: string, choices: string[], imagePrompt: string }
}
