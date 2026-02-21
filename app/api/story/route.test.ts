import { describe, it, expect, vi, beforeEach } from 'vitest';

import { runStory } from '@/ai/story';

import { POST } from './route';

vi.mock('@/ai/story', () => ({
  runStory: vi.fn(),
}));

const mockRunStory = vi.mocked(runStory);

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/story', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

const mockStoryBeatResponse = {
  storyText: 'Once upon a time in an enchanted forest...',
  choices: ['Follow the glowing path', 'Talk to the wise owl'],
  imagePrompt: 'A child standing at the edge of a magical forest',
  imageData: 'data:image/png;base64,fakedata',
};

describe('POST /api/story', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRunStory.mockResolvedValue(mockStoryBeatResponse);
  });

  it('returns 200 with valid minimal request (empty history)', async () => {
    const body = {
      name: 'Alice',
      history: [],
      gender: 'girl',
      language: 'en',
      theme: 'enchanted_forest',
    };

    const response = await POST(makeRequest(body));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockStoryBeatResponse);
    expect(mockRunStory).toHaveBeenCalledWith('Alice', [], 'girl', 'en', 'enchanted_forest', undefined);
  });

  it('returns 200 with valid request including history with selected beats', async () => {
    const history = [
      {
        storyText: 'The adventure begins.',
        choices: ['Go left', 'Go right'],
        imagePrompt: 'A fork in the road',
        selected: 'Go left',
      },
      {
        storyText: 'You find a treasure chest.',
        choices: ['Open it', 'Leave it'],
        imagePrompt: 'A golden treasure chest',
        selected: 'Open it',
      },
    ];

    const body = {
      name: 'Bob',
      history,
      gender: 'boy',
      language: 'th',
      theme: 'space_adventure',
    };

    const response = await POST(makeRequest(body));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockStoryBeatResponse);
    expect(mockRunStory).toHaveBeenCalledWith('Bob', history, 'boy', 'th', 'space_adventure', undefined);
  });

  it('returns 400 when name is empty string', async () => {
    const body = {
      name: '',
      history: [],
      gender: 'boy',
      language: 'en',
      theme: 'enchanted_forest',
    };

    const response = await POST(makeRequest(body));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation failed');
    expect(data.details).toBeDefined();
  });

  it('returns 400 when gender is invalid value', async () => {
    const body = {
      name: 'Alice',
      history: [],
      gender: 'other',
      language: 'en',
      theme: 'enchanted_forest',
    };

    const response = await POST(makeRequest(body));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation failed');
    expect(data.details).toBeDefined();
  });

  it('returns 400 when language is invalid value', async () => {
    const body = {
      name: 'Alice',
      history: [],
      gender: 'girl',
      language: 'fr',
      theme: 'enchanted_forest',
    };

    const response = await POST(makeRequest(body));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation failed');
    expect(data.details).toBeDefined();
  });

  it('returns 400 when theme is invalid value', async () => {
    const body = {
      name: 'Alice',
      history: [],
      gender: 'girl',
      language: 'en',
      theme: 'haunted_house',
    };

    const response = await POST(makeRequest(body));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation failed');
    expect(data.details).toBeDefined();
  });

  it('returns 500 when runStory throws an error', async () => {
    mockRunStory.mockRejectedValue(new Error('OpenAI API failure'));

    const body = {
      name: 'Alice',
      history: [],
      gender: 'girl',
      language: 'en',
      theme: 'enchanted_forest',
    };

    const response = await POST(makeRequest(body));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
    expect(data.message).toBe('OpenAI API failure');
  });
});
