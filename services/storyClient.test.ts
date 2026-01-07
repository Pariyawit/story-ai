import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { StoryBeat, Gender, Language, StoryTheme } from '@/types';

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
});
