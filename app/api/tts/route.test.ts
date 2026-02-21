import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockCreate } = vi.hoisted(() => ({
  mockCreate: vi.fn(),
}));

vi.mock('@/ai/ai', () => ({
  openai: {
    audio: {
      speech: {
        create: mockCreate,
      },
    },
  },
}));

import { POST } from './route';

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/tts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreate.mockResolvedValue({
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
    });
  });

  it('returns 200 with audio/mpeg content type for valid request', async () => {
    const body = { text: 'Hello, brave adventurer!', language: 'en' };

    const response = await POST(makeRequest(body));

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('audio/mpeg');
    expect(response.headers.get('Content-Length')).toBe('8');

    const buffer = await response.arrayBuffer();
    expect(buffer.byteLength).toBe(8);
  });

  it('uses shimmer voice for Thai language', async () => {
    const body = { text: 'สวัสดีนักผจญภัย', language: 'th' };

    await POST(makeRequest(body));

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        voice: 'shimmer',
        input: 'สวัสดีนักผจญภัย',
      })
    );
  });

  it('uses nova voice for English language', async () => {
    const body = { text: 'Hello, brave adventurer!', language: 'en' };

    await POST(makeRequest(body));

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        voice: 'nova',
        input: 'Hello, brave adventurer!',
      })
    );
  });

  it('returns 400 when text is missing', async () => {
    const body = { language: 'en' };

    const response = await POST(makeRequest(body));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation failed');
    expect(data.details).toBeDefined();
  });

  it('returns 400 when language is invalid', async () => {
    const body = { text: 'Hello', language: 'fr' };

    const response = await POST(makeRequest(body));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation failed');
    expect(data.details).toBeDefined();
  });

  it('returns 500 when OpenAI API throws', async () => {
    mockCreate.mockRejectedValue(new Error('TTS service unavailable'));

    const body = { text: 'Hello', language: 'en' };

    const response = await POST(makeRequest(body));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to generate speech');
    expect(data.message).toBe('TTS service unavailable');
  });
});
