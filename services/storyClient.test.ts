import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { StoryBeat, Gender, Language, StoryTheme, CharacterCustomization } from '@/types';

import { postStory } from './storyClient';

// Mock types
const mockStoryBeat: StoryBeat = {
  storyText: 'Once upon a time',
  choices: ['Go left', 'Go right'],
  imagePrompt: 'A dark forest',
  imageData: 'data:image/png;base64,fakeimagedata', // This should be stripped
  selected: 'Go left',
};

describe('storyClient', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockClear();
    global.fetch = fetchMock;
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockStoryBeat,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should strip imageData from history before sending request', async () => {
    const history = [mockStoryBeat];

    await postStory('Hero', history, 'boy' as Gender, 'en' as Language, 'enchanted_forest' as StoryTheme);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const callArgs = fetchMock.mock.calls[0];
    const body = JSON.parse(callArgs[1].body);

    expect(body.history).toHaveLength(1);
    expect(body.history[0].storyText).toBe('Once upon a time');
    expect(body.history[0].imageData).toBeUndefined(); // Crucial assertion
    expect(body.history[0].imagePrompt).toBe('A dark forest');
  });

  it('throws error when response is not ok', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
    });

    await expect(
      postStory('Hero', [], 'boy' as Gender, 'en' as Language, 'enchanted_forest' as StoryTheme)
    ).rejects.toThrow('Failed to get next story beat');
  });

  it('sends correct request body shape', async () => {
    await postStory('Hero', [], 'girl' as Gender, 'th' as Language, 'space_adventure' as StoryTheme);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    const body = JSON.parse(options.body);

    expect(url).toBe('/api/story');
    expect(options.method).toBe('POST');
    expect(options.headers).toEqual({ 'Content-Type': 'application/json' });
    expect(body).toEqual({
      name: 'Hero',
      history: [],
      gender: 'girl',
      language: 'th',
      theme: 'space_adventure',
    });
  });

  it('passes optional character parameter when provided', async () => {
    const character: CharacterCustomization = {
      hairColor: 'brown',
      hairStyle: 'short',
      outfitStyle: 'adventurer',
      favoriteColor: 'blue',
    };

    await postStory('Hero', [], 'boy' as Gender, 'en' as Language, 'enchanted_forest' as StoryTheme, character);

    const [, options] = fetchMock.mock.calls[0];
    const body = JSON.parse(options.body);

    expect(body.character).toEqual(character);
  });

  it('strips imageData from multiple history beats', async () => {
    const history: StoryBeat[] = [
      {
        storyText: 'Beat one',
        choices: ['A', 'B'],
        imagePrompt: 'Prompt 1',
        imageData: 'data:image/png;base64,imagedata1',
        selected: 'A',
      },
      {
        storyText: 'Beat two',
        choices: ['C', 'D'],
        imagePrompt: 'Prompt 2',
        imageData: 'data:image/png;base64,imagedata2',
        selected: 'C',
      },
      {
        storyText: 'Beat three',
        choices: ['E', 'F'],
        imagePrompt: 'Prompt 3',
        imageData: 'data:image/png;base64,imagedata3',
        selected: 'E',
      },
    ];

    await postStory('Hero', history, 'boy' as Gender, 'en' as Language, 'enchanted_forest' as StoryTheme);

    const [, options] = fetchMock.mock.calls[0];
    const body = JSON.parse(options.body);

    expect(body.history).toHaveLength(3);
    body.history.forEach((beat: Record<string, unknown>) => {
      expect(beat.imageData).toBeUndefined();
    });
    expect(body.history[0].storyText).toBe('Beat one');
    expect(body.history[1].storyText).toBe('Beat two');
    expect(body.history[2].storyText).toBe('Beat three');
  });
});
