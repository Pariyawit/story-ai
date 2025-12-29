export type Gender = 'boy' | 'girl';
export type Language = 'th' | 'en';

export type ChoiceWithTransition = {
  text: string;
  transition: string[];
};

export type StoryBeat = {
  storyText: string;
  choices: string[];
  choicesWithTransition?: ChoiceWithTransition[];
  imageUrl?: string;
  imagePrompt: string;
  selected?: string;
};

// history is array of Step
export type History = StoryBeat[];

export type LlmResponse = {
  storyText: string;
  choices: string[];
  choicesWithTransition?: ChoiceWithTransition[];
  imagePrompt: string;
};
