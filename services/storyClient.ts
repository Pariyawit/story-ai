import { StoryBeat, Gender, Language, StoryTheme, CharacterCustomization } from '@/types';

/**
 * Fetches an image from a URL and converts it to a base64 data URL.
 * This is needed because OpenAI DALL-E image URLs are temporary (expire after ~60 min).
 * Converting to base64 ensures images work for PDF export at any time.
 * Returns null if the image cannot be fetched.
 */
async function fetchImageAsBase64(imageUrl: string): Promise<string | null> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.warn(`Failed to fetch image: ${response.status}`);
      return null;
    }
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        console.warn('FileReader error converting image to base64');
        resolve(null);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn('Error fetching image for base64 conversion:', error);
    return null;
  }
}

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

  const storyBeat: StoryBeat = await response.json();

  // Convert temporary image URL to permanent base64 data URL
  // This ensures images work for PDF export even after DALL-E URLs expire (~60 min)
  if (storyBeat.imageUrl && !storyBeat.imageUrl.startsWith('data:')) {
    const base64Image = await fetchImageAsBase64(storyBeat.imageUrl);
    if (base64Image) {
      storyBeat.imageUrl = base64Image;
    }
  }

  return storyBeat;
}
