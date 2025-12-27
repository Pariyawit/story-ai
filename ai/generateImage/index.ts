import { openai } from '../ai';
import { ImageGenerateParamsNonStreaming } from 'openai/resources';

type generateImageArgs = Pick<
  ImageGenerateParamsNonStreaming,
  'prompt' | 'size'
>;

export const generateImage = async ({ prompt }: generateImageArgs) => {
  const response = await openai.images.generate({
    model: 'dall-e-3',
    n: 1,
    prompt,
    size: '1024x1792',
  });

  return response.data?.[0]?.url ?? '';
};
