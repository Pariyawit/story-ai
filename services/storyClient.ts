import { StoryBeat, Gender, Language, StoryTheme, CharacterCustomization } from '@/types';

export async function postStory(
  name: string,
  history: StoryBeat[],
  gender: Gender,
  language: Language,
  theme: StoryTheme,
  character?: CharacterCustomization
): Promise<StoryBeat> {
  const response = await fetch('/api/story', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, history, gender, language, theme, character }),
  });

  if (!response.ok) throw new Error('Failed to get next story beat');

  // Images are now returned as base64 data URLs directly from the server
  // This eliminates CORS issues and URL expiry problems
  const storyBeat: StoryBeat = await response.json();
  return storyBeat;
}
