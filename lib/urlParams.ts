import { Gender, Language, StoryTheme } from '@/types';

/**
 * Valid values for URL query parameters
 */
const VALID_GENDERS: Gender[] = ['boy', 'girl'];
const VALID_LANGUAGES: Language[] = ['en', 'th', 'singlish'];
const VALID_THEMES: StoryTheme[] = [
  'enchanted_forest',
  'space_adventure',
  'underwater_kingdom',
  'dinosaur_land',
  'fairy_tale_castle',
];

/**
 * Parsed and validated URL parameters for story initialization
 */
export interface UrlParams {
  name?: string;
  gender?: Gender;
  language?: Language;
  theme?: StoryTheme;
}

/**
 * Sanitize a name string - remove HTML tags and limit length
 */
function sanitizeName(name: string): string {
  // Remove HTML tags
  const sanitized = name.replace(/<[^>]*>/g, '');
  // Trim whitespace and limit to 50 characters
  return sanitized.trim().slice(0, 50);
}

/**
 * Parse and validate URL query parameters for story preloading.
 * All parameters are optional. Invalid values are silently ignored.
 *
 * Supported params:
 * - name: string (max 50 chars, HTML stripped)
 * - gender: 'boy' | 'girl'
 * - language: 'en' | 'th' | 'singlish'
 * - theme: valid StoryTheme
 *
 * @example
 * // URL: ?name=Alex&gender=girl&language=singlish
 * parseUrlParams(searchParams) // { name: 'Alex', gender: 'girl', language: 'singlish' }
 *
 * @example
 * // URL: ?name=Test&gender=invalid
 * parseUrlParams(searchParams) // { name: 'Test' } - invalid gender ignored
 */
export function parseUrlParams(searchParams: URLSearchParams): UrlParams {
  const params: UrlParams = {};

  // Parse name (optional, sanitized)
  const name = searchParams.get('name');
  if (name) {
    const sanitized = sanitizeName(name);
    if (sanitized.length > 0) {
      params.name = sanitized;
    }
  }

  // Parse gender (optional, validated)
  const gender = searchParams.get('gender');
  if (gender && VALID_GENDERS.includes(gender as Gender)) {
    params.gender = gender as Gender;
  }

  // Parse language (optional, validated)
  const language = searchParams.get('language');
  if (language && VALID_LANGUAGES.includes(language as Language)) {
    params.language = language as Language;
  }

  // Parse theme (optional, validated)
  const theme = searchParams.get('theme');
  if (theme && VALID_THEMES.includes(theme as StoryTheme)) {
    params.theme = theme as StoryTheme;
  }

  return params;
}

/**
 * Get URL parameters from the current browser location.
 * Returns empty object if not in browser environment.
 */
export function getUrlParams(): UrlParams {
  if (typeof window === 'undefined') {
    return {};
  }
  const searchParams = new URLSearchParams(window.location.search);
  return parseUrlParams(searchParams);
}
