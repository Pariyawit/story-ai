export type Gender = 'boy' | 'girl';
export type Language = 'th' | 'en' | 'singlish';
export type StoryTheme =
  | 'enchanted_forest'
  | 'space_adventure'
  | 'underwater_kingdom'
  | 'dinosaur_land'
  | 'fairy_tale_castle';

// Character Customization Types
export type HairColor = 'brown' | 'black' | 'blonde' | 'red' | 'blue' | 'pink';
export type HairStyle = 'short' | 'long' | 'curly' | 'braids' | 'ponytail';
export type OutfitStyle = 'adventurer' | 'princess' | 'superhero' | 'wizard' | 'explorer';
export type FavoriteColor = 'purple' | 'blue' | 'pink' | 'green' | 'red' | 'yellow';

export type CharacterCustomization = {
  hairColor: HairColor;
  hairStyle: HairStyle;
  outfitStyle: OutfitStyle;
  favoriteColor: FavoriteColor;
};

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
