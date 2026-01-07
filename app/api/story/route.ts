import { z } from 'zod';

import { runStory } from '@/ai/story';

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
  imageData: z.string().optional(),
  imagePrompt: z.string(),
  selected: z.string().optional(),
});

// Zod schema for CharacterCustomization
const characterSchema = z.object({
  hairColor: z.enum(['brown', 'black', 'blonde', 'red', 'blue', 'pink']),
  hairStyle: z.enum(['short', 'long', 'curly', 'braids', 'ponytail']),
  outfitStyle: z.enum(['adventurer', 'princess', 'superhero', 'wizard', 'explorer']),
  favoriteColor: z.enum(['purple', 'blue', 'pink', 'green', 'red', 'yellow']),
});

// Zod schema for request body
const requestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  history: z.array(storyBeatSchema),
  gender: z.enum(['boy', 'girl']),
  language: z.enum(['th', 'en', 'singlish']),
  theme: z.enum(['enchanted_forest', 'space_adventure', 'underwater_kingdom', 'dinosaur_land', 'fairy_tale_castle']),
  character: characterSchema.optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validatedData = requestSchema.parse(body);

    const { name, history, gender, language, theme, character } = validatedData;

    // if history is empty
    // Mock response for now
    const data = await runStory(name, history, gender, language, theme, character);

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
