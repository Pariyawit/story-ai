import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { Language } from '@/types';

import { fetchSpeech } from './ttsClient';

describe('ttsClient', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockClear();
    global.fetch = fetchMock;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns blob on success', async () => {
    const mockBlob = new Blob(['audio'], { type: 'audio/mpeg' });
    fetchMock.mockResolvedValue({
      ok: true,
      blob: async () => mockBlob,
    });

    const result = await fetchSpeech('Hello world', 'en' as Language);

    expect(result).toBeInstanceOf(Blob);
    expect(result).toBe(mockBlob);
  });

  it('throws error when response is not ok', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
    });

    await expect(fetchSpeech('Hello world', 'en' as Language)).rejects.toThrow('Failed to generate speech');
  });

  it('sends correct request body', async () => {
    const mockBlob = new Blob(['audio']);
    fetchMock.mockResolvedValue({
      ok: true,
      blob: async () => mockBlob,
    });

    await fetchSpeech('Once upon a time', 'th' as Language);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    const body = JSON.parse(options.body);

    expect(url).toBe('/api/tts');
    expect(options.method).toBe('POST');
    expect(options.headers).toEqual({ 'Content-Type': 'application/json' });
    expect(body).toEqual({
      text: 'Once upon a time',
      language: 'th',
    });
  });
});
