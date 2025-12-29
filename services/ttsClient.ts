import { Language } from '@/types';

export async function fetchSpeech(text: string, language: Language): Promise<Blob> {
  const response = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, language }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate speech');
  }

  return response.blob();
}
