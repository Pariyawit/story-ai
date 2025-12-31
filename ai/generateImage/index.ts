import { ImageGenerateParamsNonStreaming } from "openai/resources";

import { openai } from "../ai";

type generateImageArgs = Pick<ImageGenerateParamsNonStreaming, "prompt" | "size">;

export const generateImage = async ({ prompt }: generateImageArgs) => {
  const response = await openai.images.generate({
    model: "dall-e-2",
    n: 1,
    prompt,
    size: "512x512",
  });

  return response.data?.[0]?.url ?? "";
};
