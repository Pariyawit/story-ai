import { Translations } from '../types';

/**
 * Singlish (Singapore English) translations
 * Uses predominantly English with subtle Singlish expressions
 */
const singlish: Translations = {
  // Start Screen - Use standard English for form elements
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

  // Story Screen - with Singlish flavor
  'storyScreen.summary': '📖 Summary lah',
  'storyScreen.galleryView': '🎠 Gallery View lah',
  'storyScreen.fullStory': '📖 Full Story leh',
  'storyScreen.completeStory': '📖 The Complete Story lah',
  'storyScreen.pageIndicator': 'Page {{current}}/12 leh',

  // Choice Buttons - Singlish celebration
  'choiceButtons.congratsTitle': 'Wah, Congrats, Brave Adventurer!',
  'choiceButtons.congratsMessage': 'Shiok! You finished your magical journey lah!',
  'choiceButtons.restartButton': 'The End lah - Start New Adventure!',

  // Export PDF - with Singlish flair
  'pdf.title': 'The Shiok Adventure of',
  'pdf.subtitle': 'A Personal Story Book lor',
  'pdf.scenesCount': '{{count}} Scenes leh',
  'pdf.sceneLabel': 'Scene {{index}} lah',
  'pdf.choiceLabel': 'You chose lor: ',
  'pdf.endText': 'The End lah!',
  'pdf.congratsText': 'Thanks for joining the adventure lah!',
  'pdf.creditText': 'Created by {{name}} one',
  'pdf.downloadButton': '📥 Download Story Book lah (PDF)',
  'pdf.creatingButton': '⏳ Creating PDF leh...',
  'pdf.errorText': 'Alamak! Cannot create PDF. Try again lah.',

  // Transition Screen
  'transition.loading': '✨ Magic happening sia... ✨',

  // Story Carousel
  'carousel.noStory': 'No story yet leh',
  'carousel.noImage': 'No image leh',
  'carousel.youChose': 'You chose lor:',
  'carousel.navHint': 'Use arrow keys or click dots to navigate lah',
  'carousel.sceneIndicator': 'Scene {{current}} / {{total}} lah',

  // Speak Button
  'speak.listen': '🔊 Listen leh',
  'speak.stop': '🔇 Stop lah',
  'speak.loading': '⏳ Loading lah...',

  // Character Wizard - Use standard English for clarity
  'character.designTitle': 'Design Your Character',
  'character.hairColor': 'Hair Color',
  'character.hairStyle': 'Hair Style',
  'character.outfit': 'Outfit',
  'character.favoriteColor': 'Favorite Color (for outfit)',

  // Theme Labels - Use standard English
  'theme.enchantedForest': 'Enchanted Forest',
  'theme.spaceAdventure': 'Space Adventure',
  'theme.underwaterKingdom': 'Underwater Kingdom',
  'theme.dinosaurLand': 'Dinosaur Land',
  'theme.fairyTaleCastle': 'Fairy Tale Castle',

  // Character Option Labels - Use standard English
  'hairColor.brown': 'Brown',
  'hairColor.black': 'Black',
  'hairColor.blonde': 'Blonde',
  'hairColor.red': 'Red',
  'hairColor.blue': 'Blue',
  'hairColor.pink': 'Pink',

  'hairStyle.short': 'Short',
  'hairStyle.long': 'Long',
  'hairStyle.curly': 'Curly',
  'hairStyle.braids': 'Braids',
  'hairStyle.ponytail': 'Ponytail',

  'outfit.adventurer': 'Adventurer',
  'outfit.princess': 'Royal',
  'outfit.superhero': 'Superhero',
  'outfit.wizard': 'Wizard',
  'outfit.explorer': 'Explorer',

  'favoriteColor.purple': 'Purple',
  'favoriteColor.blue': 'Blue',
  'favoriteColor.pink': 'Pink',
  'favoriteColor.green': 'Green',
  'favoriteColor.red': 'Red',
  'favoriteColor.yellow': 'Yellow',
};

export default singlish;
