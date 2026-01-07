/**
 * AI/LLM prompt modules for language-specific content.
 *
 * These are separate from UI translations because they contain
 * extensive prompt engineering with examples and rules.
 */

export { getLanguageInstruction } from './instructions';
export { getChoiceRules } from './choiceRules';
export { getJsonFormatExample } from './jsonExamples';
export { getInitialTransitionTexts } from './transitions';
