import { ImageGenerateParamsNonStreaming } from 'openai/resources';

import { openai } from '../ai';

type generateImageArgs = Pick<ImageGenerateParamsNonStreaming, 'prompt' | 'size'>;

/**
 * Generates an image using OpenAI DALL-E and returns it as a base64 data URL.
 * Using b64_json format instead of URL to:
 * 1. Avoid CORS issues (OpenAI URLs are hosted on Azure which blocks cross-origin requests)
 * 2. Eliminate image URL expiry issues (~60 min expiration)
 * 3. Remove the need for client-side conversion
 */
export const generateImage = async ({ prompt }: generateImageArgs) => {
  const response = await openai.images.generate({
    model: 'dall-e-2',
    n: 1,
    prompt,
    size: '512x512',
    response_format: 'b64_json',
  });

  const b64Data = response.data?.[0]?.b64_json;
  if (!b64Data) {
    return '';
  }

  // Return as a complete data URL that can be used directly in img src
  return `data:image/png;base64,${b64Data}`;
};
