import { runLLM } from '@/ai/llm';
import { runStory } from '@/ai/story';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// Zod schema for StoryBeat
const storyBeatSchema = z.object({
  storyText: z.string(),
  choices: z.array(z.string()),
  imageUrl: z.string(),
  selected: z.number().optional(),
});

// Zod schema for request body
const requestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  history: z.array(storyBeatSchema),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validatedData = requestSchema.parse(body);

    const { name, history } = validatedData;

    // if history is empty
    // Mock response for now
    const data = await runStory(name, history);

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
