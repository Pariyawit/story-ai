export type StoryBeat = {
  storyText: string;
  choices: string[];
  imageUrl: string;
  selected?: number;
};

// history is array of Step
export type History = StoryBeat[];

export type LlmResponse = {
  storyText: string;
  choices: string[];
  imagePrompt: string;
};
