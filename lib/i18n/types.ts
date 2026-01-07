import { Language } from '@/types';

/**
 * All translation keys used in the application.
 * Organized by component/feature area.
 */
export type TranslationKey =
  // Start Screen
  | 'startScreen.subtitle'
  | 'startScreen.nameLabel'
  | 'startScreen.namePlaceholder'
  | 'startScreen.genderLabel'
  | 'startScreen.genderBoy'
  | 'startScreen.genderGirl'
  | 'startScreen.languageLabel'
  | 'startScreen.characterDesign'
  | 'startScreen.storyWorld'
  | 'startScreen.startAdventure'
  // Story Screen
  | 'storyScreen.summary'
  | 'storyScreen.galleryView'
  | 'storyScreen.fullStory'
  | 'storyScreen.completeStory'
  | 'storyScreen.pageIndicator'
  // Choice Buttons
  | 'choiceButtons.congratsTitle'
  | 'choiceButtons.congratsMessage'
  | 'choiceButtons.restartButton'
  // Export PDF
  | 'pdf.title'
  | 'pdf.subtitle'
  | 'pdf.scenesCount'
  | 'pdf.sceneLabel'
  | 'pdf.choiceLabel'
  | 'pdf.endText'
  | 'pdf.congratsText'
  | 'pdf.creditText'
  | 'pdf.downloadButton'
  | 'pdf.creatingButton'
  | 'pdf.errorText'
  // Transition Screen
  | 'transition.loading'
  // Story Carousel
  | 'carousel.noStory'
  | 'carousel.noImage'
  | 'carousel.youChose'
  | 'carousel.navHint'
  | 'carousel.sceneIndicator'
  // Speak Button
  | 'speak.listen'
  | 'speak.stop'
  | 'speak.loading'
  // Character Wizard
  | 'character.designTitle'
  | 'character.hairColor'
  | 'character.hairStyle'
  | 'character.outfit'
  | 'character.favoriteColor'
  // Theme Labels
  | 'theme.enchantedForest'
  | 'theme.spaceAdventure'
  | 'theme.underwaterKingdom'
  | 'theme.dinosaurLand'
  | 'theme.fairyTaleCastle'
  // Character Option Labels - Hair Colors
  | 'hairColor.brown'
  | 'hairColor.black'
  | 'hairColor.blonde'
  | 'hairColor.red'
  | 'hairColor.blue'
  | 'hairColor.pink'
  // Character Option Labels - Hair Styles
  | 'hairStyle.short'
  | 'hairStyle.long'
  | 'hairStyle.curly'
  | 'hairStyle.braids'
  | 'hairStyle.ponytail'
  // Character Option Labels - Outfit Styles
  | 'outfit.adventurer'
  | 'outfit.princess'
  | 'outfit.superhero'
  | 'outfit.wizard'
  | 'outfit.explorer'
  // Character Option Labels - Favorite Colors
  | 'favoriteColor.purple'
  | 'favoriteColor.blue'
  | 'favoriteColor.pink'
  | 'favoriteColor.green'
  | 'favoriteColor.red'
  | 'favoriteColor.yellow';

/**
 * Complete translations for a single language
 */
export type Translations = Record<TranslationKey, string>;

/**
 * Parameters for string interpolation
 * e.g., { name: "Alex", count: 5 }
 */
export type InterpolationParams = Record<string, string | number>;

/**
 * Re-export Language type for convenience
 */
export type { Language };
