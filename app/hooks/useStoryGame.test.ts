import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { StoryBeat } from '@/types';

const { mockPostStory, mockGetUrlParams } = vi.hoisted(() => ({
  mockPostStory: vi.fn(),
  mockGetUrlParams: vi.fn(),
}));

vi.mock('@/services/storyClient', () => ({
  postStory: mockPostStory,
}));

vi.mock('@/lib/urlParams', () => ({
  getUrlParams: mockGetUrlParams,
}));

vi.mock('@/lib/i18n/prompts', () => ({
  getInitialTransitionTexts: vi.fn(() => ['Loading your adventure...']),
}));

import { useStoryGame } from './useStoryGame';

const mockBeat: StoryBeat = {
  storyText: 'You enter a magical forest...',
  choices: ['Go left', 'Go right', 'Climb tree'],
  imagePrompt: 'A child in a magical forest',
};

const localStorageMock: Record<string, string> = {};

beforeEach(() => {
  mockGetUrlParams.mockReturnValue({});
  mockPostStory.mockReset();
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn((key: string) => localStorageMock[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete localStorageMock[key];
      }),
      clear: vi.fn(),
    },
    writable: true,
  });
});

afterEach(() => {
  Object.keys(localStorageMock).forEach((key) => delete localStorageMock[key]);
  vi.restoreAllMocks();
});

describe('useStoryGame', () => {
  describe('initial state', () => {
    it('starts with gameState START', () => {
      const { result } = renderHook(() => useStoryGame());
      expect(result.current.gameState).toBe('START');
    });

    it('starts with empty history and null currentBeat', () => {
      const { result } = renderHook(() => useStoryGame());
      expect(result.current.history).toEqual([]);
      expect(result.current.currentBeat).toBeNull();
    });

    it('currentPage is 1 when history is empty', () => {
      const { result } = renderHook(() => useStoryGame());
      expect(result.current.currentPage).toBe(1);
    });

    it('starts with default values', () => {
      const { result } = renderHook(() => useStoryGame());
      expect(result.current.gender).toBe('boy');
      expect(result.current.language).toBe('en');
      expect(result.current.theme).toBe('enchanted_forest');
    });
  });

  describe('URL params and localStorage', () => {
    it('loads theme from localStorage when no URL param', () => {
      localStorageMock['story-theme'] = 'space_adventure';
      const { result } = renderHook(() => useStoryGame());
      expect(result.current.theme).toBe('space_adventure');
    });

    it('URL params override localStorage for theme', () => {
      localStorageMock['story-theme'] = 'space_adventure';
      mockGetUrlParams.mockReturnValue({ theme: 'dinosaur_land' });
      const { result } = renderHook(() => useStoryGame());
      expect(result.current.theme).toBe('dinosaur_land');
    });

    it('loads valid character from localStorage', () => {
      const validCharacter = {
        hairColor: 'black',
        hairStyle: 'curly',
        outfitStyle: 'wizard',
        favoriteColor: 'green',
      };
      localStorageMock['story-character'] = JSON.stringify(validCharacter);
      const { result } = renderHook(() => useStoryGame());
      expect(result.current.character).toEqual(validCharacter);
    });

    it('ignores invalid character from localStorage', () => {
      localStorageMock['story-character'] = JSON.stringify({
        hairColor: 'rainbow',
        hairStyle: 'mohawk',
        outfitStyle: 'invalid',
        favoriteColor: 'neon',
      });
      const { result } = renderHook(() => useStoryGame());
      expect(result.current.character).toEqual({
        hairColor: 'brown',
        hairStyle: 'short',
        outfitStyle: 'adventurer',
        favoriteColor: 'purple',
      });
    });
  });

  describe('handleNameSubmit', () => {
    it('transitions to STORY on successful postStory', async () => {
      mockPostStory.mockResolvedValue(mockBeat);
      const { result } = renderHook(() => useStoryGame());

      await act(async () => {
        result.current.setNameInput('Alice');
      });

      const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;
      await act(async () => {
        await result.current.handleNameSubmit(mockEvent);
      });

      expect(result.current.gameState).toBe('STORY');
      expect(result.current.currentBeat).toEqual(mockBeat);
      expect(result.current.playerName).toBe('Alice');
    });

    it('does nothing when nameInput is empty', async () => {
      const { result } = renderHook(() => useStoryGame());

      const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;
      await act(async () => {
        await result.current.handleNameSubmit(mockEvent);
      });

      expect(mockPostStory).not.toHaveBeenCalled();
      expect(result.current.gameState).toBe('START');
    });

    it('falls back to STORY state on postStory error', async () => {
      mockPostStory.mockRejectedValue(new Error('API error'));
      const { result } = renderHook(() => useStoryGame());

      await act(async () => {
        result.current.setNameInput('Alice');
      });

      const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;
      await act(async () => {
        await result.current.handleNameSubmit(mockEvent);
      });

      expect(result.current.gameState).toBe('STORY');
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('handleChoice', () => {
    it('adds current beat to history with selected choice on success', async () => {
      const nextBeat: StoryBeat = {
        storyText: 'You go left and find a river...',
        choices: ['Swim', 'Build a raft', 'Follow the bank'],
        imagePrompt: 'A child by a river',
      };

      mockPostStory.mockResolvedValueOnce(mockBeat).mockResolvedValueOnce(nextBeat);

      const { result } = renderHook(() => useStoryGame());

      await act(async () => {
        result.current.setNameInput('Alice');
      });

      const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;
      await act(async () => {
        await result.current.handleNameSubmit(mockEvent);
      });

      expect(result.current.history).toHaveLength(0);

      await act(async () => {
        await result.current.handleChoice('Go left');
      });

      expect(result.current.history).toHaveLength(1);
      expect(result.current.history[0].selected).toBe('Go left');
      expect(result.current.currentBeat).toEqual(nextBeat);
    });

    it('does NOT update history when postStory fails', async () => {
      mockPostStory.mockResolvedValueOnce(mockBeat).mockRejectedValueOnce(new Error('API error'));

      const { result } = renderHook(() => useStoryGame());

      await act(async () => {
        result.current.setNameInput('Alice');
      });

      const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;
      await act(async () => {
        await result.current.handleNameSubmit(mockEvent);
      });

      await act(async () => {
        await result.current.handleChoice('Go left');
      });

      expect(result.current.history).toHaveLength(0);
    });

    it('does nothing when currentBeat is null', async () => {
      const { result } = renderHook(() => useStoryGame());

      await act(async () => {
        await result.current.handleChoice('Go left');
      });

      expect(mockPostStory).not.toHaveBeenCalled();
    });
  });

  describe('handleRestart', () => {
    it('resets all state to initial values', async () => {
      mockPostStory.mockResolvedValue(mockBeat);
      const { result } = renderHook(() => useStoryGame());

      await act(async () => {
        result.current.setNameInput('Alice');
      });

      const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;
      await act(async () => {
        await result.current.handleNameSubmit(mockEvent);
      });

      expect(result.current.gameState).toBe('STORY');
      expect(result.current.playerName).toBe('Alice');

      await act(async () => {
        result.current.handleRestart();
      });

      expect(result.current.gameState).toBe('START');
      expect(result.current.playerName).toBe('');
      expect(result.current.nameInput).toBe('');
      expect(result.current.gender).toBe('boy');
      expect(result.current.language).toBe('en');
      expect(result.current.history).toEqual([]);
      expect(result.current.currentBeat).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.transitionTexts).toEqual([]);
    });
  });
});
