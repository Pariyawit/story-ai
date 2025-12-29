import { openai } from '@/ai/ai';
import { z } from 'zod';
import { Language } from '@/types';
import type { SpeechCreateParams } from 'openai/resources/audio/speech';

export const dynamic = 'force-dynamic';

// Type alias for OpenAI TTS voice options
type TTSVoice = SpeechCreateParams['voice'];

// Zod schema for request body
const requestSchema = z.object({
  text: z.string().min(1, 'Text is required'),
  language: z.enum(['th', 'en']),
});

// Voice selection based on language for baby story telling
// Using voices that are warm, friendly, and suitable for children
const getVoiceForLanguage = (language: Language): TTSVoice => {
  // nova: Warm, friendly female voice - great for children's stories in English
  // shimmer: Soft, gentle voice - works well for Thai as it handles tonal languages
  if (language === 'th') {
    return 'shimmer'; // Gentle voice, good for Thai language stories
  }
  return 'nova'; // Warm, friendly voice perfect for English children's stories
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = requestSchema.parse(body);
    const { text, language } = validatedData;

    const voice = getVoiceForLanguage(language);

    // Generate speech using OpenAI TTS API
    // Settings optimized for baby story telling:
    // - tts-1 model for fast response
    // - Slower speed (0.85) for clearer pronunciation for children
    const mp3Response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voice,
      input: text,
      speed: 0.85, // Slightly slower for better comprehension by young children
      response_format: 'mp3',
    });

    // Get the audio as an ArrayBuffer and return it
    const audioBuffer = await mp3Response.arrayBuffer();

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return Response.json(
        {
          error: 'Validation failed',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    // Handle other errors
    console.error('TTS error:', error);
    return Response.json(
      {
        error: 'Failed to generate speech',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
