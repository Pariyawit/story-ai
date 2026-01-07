import { Translations } from '../types';

/**
 * English translations - the base/fallback language
 */
const en: Translations = {
  // Start Screen
  'startScreen.subtitle': "What's your name, brave explorer?",
  'startScreen.nameLabel': 'Your name',
  'startScreen.namePlaceholder': 'Enter your name...',
  'startScreen.genderLabel': 'Gender',
  'startScreen.genderBoy': '👦 Boy',
  'startScreen.genderGirl': '👧 Girl',
  'startScreen.languageLabel': 'Language',
  'startScreen.characterDesign': 'Character Design',
  'startScreen.storyWorld': 'Story World',
  'startScreen.startAdventure': 'Start Adventure',

  // Story Screen
  'storyScreen.summary': '📖 Summary',
  'storyScreen.galleryView': '🎠 Gallery View',
  'storyScreen.fullStory': '📖 Full Story',
  'storyScreen.completeStory': '📖 The Complete Story',
  'storyScreen.pageIndicator': 'Page {{current}}/12',

  // Choice Buttons
  'choiceButtons.congratsTitle': 'Congratulations, Brave Adventurer!',
  'choiceButtons.congratsMessage': "You've completed your magical journey!",
  'choiceButtons.restartButton': 'The End - Start New Adventure',

  // Export PDF
  'pdf.title': 'The Adventure of',
  'pdf.subtitle': 'A Personal Story Book',
  'pdf.scenesCount': '{{count}} Scenes',
  'pdf.sceneLabel': 'Scene {{index}}',
  'pdf.choiceLabel': 'You chose: ',
  'pdf.endText': 'The End',
  'pdf.congratsText': 'Thank you for joining the adventure!',
  'pdf.creditText': 'Created by {{name}}',
  'pdf.downloadButton': '📥 Download Story Book (PDF)',
  'pdf.creatingButton': '⏳ Creating PDF...',
  'pdf.errorText': 'Failed to create PDF. Please try again.',

  // Transition Screen
  'transition.loading': '✨ Magic is happening... ✨',

  // Story Carousel
  'carousel.noStory': 'No story yet',
  'carousel.noImage': 'No image',
  'carousel.youChose': 'You chose:',
  'carousel.navHint': 'Use arrow keys or click dots to navigate',
  'carousel.sceneIndicator': 'Scene {{current}} / {{total}}',

  // Speak Button
  'speak.listen': '🔊 Listen',
  'speak.stop': '🔇 Stop',
  'speak.loading': '⏳ Loading...',

  // Character Wizard
  'character.designTitle': 'Design Your Character',
  'character.hairColor': 'Hair Color',
  'character.hairStyle': 'Hair Style',
  'character.outfit': 'Outfit',
  'character.favoriteColor': 'Favorite Color (for outfit)',

  // Theme Labels
  'theme.enchantedForest': 'Enchanted Forest',
  'theme.spaceAdventure': 'Space Adventure',
  'theme.underwaterKingdom': 'Underwater Kingdom',
  'theme.dinosaurLand': 'Dinosaur Land',
  'theme.fairyTaleCastle': 'Fairy Tale Castle',

  // Character Option Labels - Hair Colors
  'hairColor.brown': 'Brown',
  'hairColor.black': 'Black',
  'hairColor.blonde': 'Blonde',
  'hairColor.red': 'Red',
  'hairColor.blue': 'Blue',
  'hairColor.pink': 'Pink',

  // Character Option Labels - Hair Styles
  'hairStyle.short': 'Short',
  'hairStyle.long': 'Long',
  'hairStyle.curly': 'Curly',
  'hairStyle.braids': 'Braids',
  'hairStyle.ponytail': 'Ponytail',

  // Character Option Labels - Outfit Styles
  'outfit.adventurer': 'Adventurer',
  'outfit.princess': 'Royal',
  'outfit.superhero': 'Superhero',
  'outfit.wizard': 'Wizard',
  'outfit.explorer': 'Explorer',

  // Character Option Labels - Favorite Colors
  'favoriteColor.purple': 'Purple',
  'favoriteColor.blue': 'Blue',
  'favoriteColor.pink': 'Pink',
  'favoriteColor.green': 'Green',
  'favoriteColor.red': 'Red',
  'favoriteColor.yellow': 'Yellow',
};

export default en;
