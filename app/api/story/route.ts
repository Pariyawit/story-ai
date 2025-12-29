import { runLLM } from '@/ai/llm';
import { runStory } from '@/ai/story';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// Zod schema for ChoiceWithTransition
const choiceWithTransitionSchema = z.object({
  text: z.string(),
  transition: z.array(z.string()),
});

// Zod schema for StoryBeat
const storyBeatSchema = z.object({
  storyText: z.string(),
  choices: z.array(z.string()),
  choicesWithTransition: z.array(choiceWithTransitionSchema).optional(),
  imageUrl: z.string().optional(),
  imagePrompt: z.string(),
  selected: z.string().optional(),
});

// Zod schema for request body
const requestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  history: z.array(storyBeatSchema),
  gender: z.enum(['boy', 'girl']),
  language: z.enum(['th', 'en']),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validatedData = requestSchema.parse(body);

    const { name, history, gender, language } = validatedData;

    // if history is empty
    // Mock response for now
    const data = await runStory(name, history, gender, language);

    return Response.json(data, { status: 200 });
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
    return Response.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
