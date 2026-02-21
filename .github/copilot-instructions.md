# Copilot Coding Agent Instructions for Story AI

## Repository Overview

Story AI is an AI-powered interactive children's storytelling web application. It creates personalized adventures using OpenAI's GPT-4o-mini for narrative generation and DALL-E 2 for watercolor-style illustrations. Children follow the Hero's Journey through 12 story beats, making choices that shape their adventure.

**Project Type:** Next.js 16.1.1 web application (App Router)  
**Languages:** TypeScript 5.x  
**Frameworks:** React 19.2.3, Tailwind CSS 4.x  
**Runtime:** Node.js 20+  
**Repository Size:** Small-Medium (~48 source files)

---

## Build & Validation Commands

### Prerequisites

- Node.js 20 or higher required
- pnpm 9.x or higher

### Essential Commands

| Command                                        | Purpose                      | Notes                                                  |
| ---------------------------------------------- | ---------------------------- | ------------------------------------------------------ |
| `pnpm install`                                 | Install dependencies         | Always run first after clone or dependency changes     |
| `OPENAI_API_KEY=sk-placeholder pnpm run build` | Production build             | **CRITICAL:** Build fails without `OPENAI_API_KEY` set |
| `pnpm run lint`                                | Run ESLint                   | May have pre-existing warnings (see Known Issues)      |
| `pnpm run lint:fix`                            | Auto-fix lint issues         | Fixes formatting and import order automatically        |
| `pnpm run format`                              | Format all files (Prettier)  | Writes changes directly to files                       |
| `pnpm run format:check`                        | Check formatting             | Fails if any file is unformatted (use in CI)           |
| `pnpm run typecheck`                           | TypeScript type checking     | Runs `tsc --noEmit`                                    |
| `pnpm run check`                               | Run all quality checks       | Runs typecheck + lint + format:check                   |
| `pnpm run test`                                | Run Vitest in watch mode     | Interactive test runner                                |
| `pnpm run test:run`                            | Run tests once               | For CI/CD pipelines                                    |
| `pnpm run test:coverage`                       | Run tests with coverage      | Generates coverage report                              |
| `pnpm run dev`                                 | Start dev server (port 3000) | Requires valid OpenAI key for full functionality       |
| `pnpm run start`                               | Start production server      | Run after successful build                             |

### Build Sequence

1. `pnpm install` - Install all dependencies
2. `pnpm run test:run` - Run tests to verify code integrity
3. `OPENAI_API_KEY=sk-placeholder pnpm run build` - Build the application

**Important:** The build command **MUST** have `OPENAI_API_KEY` environment variable set, even with a placeholder value. Without it, the build fails.

---

## Testing

The project uses **Vitest** with **React Testing Library** for testing.

### Test Files

| File                                            | Description                                                   |
| ----------------------------------------------- | ------------------------------------------------------------- |
| `ai/story.test.ts`                              | Story orchestration logic, history mapping, choice validation |
| `app/components/story/StoryScreen.test.tsx`     | StoryScreen component rendering and interactions              |
| `app/components/story/StoryCarousel.test.tsx`   | Image carousel navigation tests                               |
| `app/components/story/ExportPdfButton.test.tsx` | PDF export functionality tests                                |
| `lib/__tests__/urlParams.test.ts`               | URL query parameter parsing and validation                    |
| `lib/i18n/__tests__/i18n.test.ts`               | Translation system, interpolation, and locale tests           |
| `services/storyClient.test.ts`                  | Story API client and imageData sanitization tests             |
| `vitest.smoke.test.ts`                          | Basic smoke tests                                             |

### Running Tests

```bash
pnpm run test          # Watch mode (development)
pnpm run test:run      # Single run (CI)
pnpm run test:coverage # With coverage report
```

---

## Known Issues (Pre-existing)

The repository has pre-existing lint warnings (18 warnings, 0 errors). These do **not** block the build or commits:

- `no-console` warnings in `ai/story.ts` and `ai/llm/index.ts` — intentional `[PERF]` and `[WARN]` logging
- `@typescript-eslint/no-unused-vars` warnings in `systemPrompt.ts`, `CharacterWizard.tsx`, `storyClient.ts`, `ExportPdfButton.test.tsx`
- `react/no-array-index-key` warnings in `ChoiceButtons.tsx`, `StoryCarousel.tsx`, `TransitionScreen.tsx` — safe for static content
- `import/no-anonymous-default-export` in `systemPrompt.ts`

All warnings are configured as `warn` (not `error`) and do not affect functionality.

---

## Project Structure

```
story-ai/
├── app/                          # Next.js App Router directory
│   ├── api/
│   │   ├── story/route.ts        # POST /api/story - story generation endpoint
│   │   └── tts/route.ts          # POST /api/tts - text-to-speech endpoint
│   ├── components/
│   │   ├── common/               # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── SpeakButton.tsx   # Text-to-speech button
│   │   └── story/                # Story-specific components
│   │       ├── CharacterWizard.tsx    # Character customization wizard
│   │       ├── ChoiceButtons.tsx
│   │       ├── ExportPdfButton.tsx    # PDF export
│   │       ├── StartScreen.tsx        # Entry screen with all options
│   │       ├── StoryCarousel.tsx      # Story review carousel
│   │       ├── StoryImage.tsx
│   │       ├── StoryScreen.tsx
│   │       ├── StoryText.tsx
│   │       └── TransitionScreen.tsx   # Choice transition animations
│   ├── hooks/
│   │   ├── useStoryGame.ts       # Main game state management
│   │   └── useLocalStorage.ts    # Persistence hook
│   ├── layout.tsx
│   ├── page.tsx                  # Main entry point (client component)
│   └── globals.css
├── ai/                           # AI integration layer
│   ├── ai.ts                     # OpenAI client instance
│   ├── story.ts                  # Story orchestration logic
│   ├── story.test.ts             # Story tests
│   ├── llm/
│   │   ├── index.ts              # LLM call wrapper
│   │   └── systemPrompt.ts       # Hero's Journey prompt with character/theme support
│   ├── generateImage/
│   │   └── index.ts              # DALL-E 2 image generation (base64 data URLs)
│   └── types.ts                  # AI message types
├── lib/
│   ├── urlParams.ts              # URL query parameter parsing
│   └── i18n/                     # Internationalization system
│       ├── index.ts              # t() translation function
│       ├── types.ts              # TranslationKey type (compile-time validation)
│       ├── locales/              # Translation files (en.ts, th.ts, singlish.ts)
│       └── prompts/              # AI prompt translations per language
├── services/
│   ├── storyClient.ts            # Story API client
│   └── ttsClient.ts              # Text-to-speech API client
├── types.ts                      # Core shared types
├── llm.txt                       # Concise LLM context file
├── vitest.config.ts              # Vitest configuration
├── vitest.setup.ts               # Test setup (jsdom)
└── vitest.smoke.test.ts          # Smoke tests
```

### Key Files

| File                                       | Purpose                                            |
| ------------------------------------------ | -------------------------------------------------- |
| `app/page.tsx`                             | Main entry point, uses `useStoryGame` hook         |
| `app/api/story/route.ts`                   | API endpoint, validates with Zod, calls `runStory` |
| `app/api/tts/route.ts`                     | TTS endpoint, uses OpenAI TTS with language voices |
| `ai/story.ts`                              | Orchestrates LLM + image generation                |
| `ai/llm/systemPrompt.ts`                   | Hero's Journey prompt with character customization |
| `types.ts`                                 | Core types used across frontend and backend        |
| `lib/urlParams.ts`                         | URL query parameter parsing for shareable links    |
| `lib/i18n/index.ts`                        | Translation function `t()` with interpolation      |
| `app/hooks/useStoryGame.ts`                | Main game state hook (~450 lines)                  |
| `app/components/story/StartScreen.tsx`     | Name, gender, language, theme, character selection |
| `app/components/story/CharacterWizard.tsx` | Character customization UI (hair, outfit, colors)  |
| `services/storyClient.ts`                  | Story API client with imageData sanitization       |

### Path Aliases

TypeScript paths configured: `@/*` → `./*` (from project root)

---

## Core Types

```typescript
// types.ts
export type Gender = 'boy' | 'girl';
export type Language = 'th' | 'en' | 'singlish';
export type StoryTheme =
  | 'enchanted_forest'
  | 'space_adventure'
  | 'underwater_kingdom'
  | 'dinosaur_land'
  | 'fairy_tale_castle';

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

export type StoryBeat = {
  storyText: string;
  choices: string[];
  choicesWithTransition?: ChoiceWithTransition[];
  imageUrl?: string;
  imagePrompt: string;
  selected?: string;
};
```

---

## Configuration Files

| File                   | Purpose                                                        |
| ---------------------- | -------------------------------------------------------------- |
| `eslint.config.mjs`    | ESLint flat config with Next.js core-web-vitals and TypeScript |
| `tsconfig.json`        | TypeScript strict mode, bundler resolution, `@/*` path alias   |
| `next.config.ts`       | Image remote patterns for DALL-E blob storage                  |
| `postcss.config.mjs`   | Tailwind CSS 4 via `@tailwindcss/postcss`                      |
| `vitest.config.ts`     | Vitest configuration with React plugin and jsdom               |
| `vitest.setup.ts`      | Test setup for jest-dom matchers                               |
| `.prettierrc`          | Prettier rules: 120-char lines, single quotes, LF endings      |
| `.editorconfig`        | Cross-editor consistency (indentation, line endings)           |
| `commitlint.config.js` | Conventional commit message enforcement                        |
| `.gitignore`           | Standard Next.js ignores plus `.env*` files                    |

---

## Environment Variables

| Variable                  | Required                  | Description                                        |
| ------------------------- | ------------------------- | -------------------------------------------------- |
| `OPENAI_API_KEY`          | Yes (for build & runtime) | OpenAI API key for GPT-4o-mini and DALL-E 2        |
| `ENABLE_IMAGE_GENERATION` | No                        | Set to `false` to disable DALL-E (default: `true`) |

---

## Feature Summary

| Feature                     | Status         | Key Files                            |
| --------------------------- | -------------- | ------------------------------------ |
| Hero's Journey (12 beats)   | ✅ Implemented | `systemPrompt.ts`                    |
| Character Customization     | ✅ Implemented | `CharacterWizard.tsx`, `types.ts`    |
| 5 Story Themes              | ✅ Implemented | `systemPrompt.ts`, `StartScreen.tsx` |
| Trilingual (EN/TH/Singlish) | ✅ Implemented | `lib/i18n/`, all UI components       |
| PDF Export                  | ✅ Implemented | `ExportPdfButton.tsx`                |
| Text-to-Speech              | ✅ Implemented | `SpeakButton.tsx`                    |
| Story Transitions           | ✅ Implemented | `TransitionScreen.tsx`               |
| Story Carousel              | ✅ Implemented | `StoryCarousel.tsx`                  |
| LocalStorage Persistence    | ✅ Implemented | `useLocalStorage.ts`                 |

---

## Development Notes

1. **Client vs Server Components**: `app/page.tsx` and components in `app/components/story/` use `'use client'` directive
2. **Zod Validation**: API route uses Zod for request validation with strict schema
3. **Image Optimization**: Uses `next/image` with remote patterns for OpenAI blob storage
4. **Character Consistency**: Character description is injected into system prompt and must remain identical across all image prompts
5. **Theme Integration**: Each theme has both narrative description (for story) and visual style (for images)

---

## Internationalization (i18n)

The project uses a centralized translation system in `lib/i18n/`:

### Translation Function

```typescript
import { t } from '@/lib/i18n';

// Simple translation
t('startScreen.title', language);

// With interpolation
t('pdf.creditText', language, { name: playerName });
```

### Key Files

| File                           | Purpose                                             |
| ------------------------------ | --------------------------------------------------- |
| `lib/i18n/index.ts`            | `t()` function and `createTranslator()`             |
| `lib/i18n/types.ts`            | `TranslationKey` type (compile-time key validation) |
| `lib/i18n/locales/en.ts`       | English translations (~90 keys)                     |
| `lib/i18n/locales/th.ts`       | Thai translations                                   |
| `lib/i18n/locales/singlish.ts` | Singlish translations                               |
| `lib/i18n/prompts/`            | AI prompt translations per language                 |

### Adding a New Language

1. Create `lib/i18n/locales/{code}.ts` with all TranslationKey entries
2. Add export to `lib/i18n/locales/index.ts`
3. Add to `locales` object in `lib/i18n/index.ts`
4. Create prompt entries in `lib/i18n/prompts/*.ts`
5. Update `Language` type in `types.ts`
6. Update Zod schemas in `app/api/story/route.ts` and `app/api/tts/route.ts`

### Singlish Language

Singlish uses predominantly English with subtle Singapore English expressions:

- Particles: "lah" (emphasis), "leh" (softer), "lor" (resignation), "sia" (exclamation)
- Expressions: "wah" (wow), "shiok" (great), "alamak" (oh no)

---

## CI/CD

**No GitHub Actions workflows exist yet.** Recommended to add:

- Build validation on push
- Test execution on PR
- ESLint checks

---

## Agent Troubleshooting & Common Hurdles

### Build Fails Silently

The most common agent issue: **the build requires `OPENAI_API_KEY` to be set** even with a placeholder value. Without it, you get a "Missing credentials" error from the OpenAI client at import time.

```bash
# Always prefix the build command:
OPENAI_API_KEY=sk-placeholder pnpm run build
```

### Image Data in StoryBeat

Images are returned as **base64 data URLs** (not remote URLs). The field is named `imageData` in the API response (not `imageUrl`). The `storyClient.ts` strips `imageData` from history before sending to the API to avoid oversized payloads.

### Placeholder Choice Validation

`ai/story.ts` detects generic LLM choices like "Choice A" or "Option 1" and logs `[WARN]` messages. This is a **warning-only system** — it does not block or retry. The story continues with whatever choices the LLM returned.

### URL Parameters Override LocalStorage

When both URL parameters and localStorage have values, **URL parameters take priority**. This is handled in `app/hooks/useStoryGame.ts` and `lib/urlParams.ts`.

### Pre-commit Hooks May Block Commits

Husky pre-commit hooks run `lint-staged` which auto-formats and lints staged files. If issues remain after auto-fix, the commit is blocked. Use `git commit --no-verify` as escape hatch.

### Conventional Commit Messages Required

Commitlint validates commit messages. Format: `<type>: <subject>` where type is one of: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `revert`, `ci`, `build`.

---

## Extension Points

### Adding a New Story Theme

1. Update `types.ts`: Add theme to `StoryTheme` union type
2. Update `ai/llm/systemPrompt.ts`: Add theme description and visual style
3. Update `app/components/story/StartScreen.tsx`: Add theme option button
4. Update Zod schema in `app/api/story/route.ts`: Add to theme enum
5. Update `lib/i18n/locales/*.ts`: Add theme label translations

### Adding a New Language

1. Create `lib/i18n/locales/{code}.ts` with all TranslationKey entries
2. Add export to `lib/i18n/locales/index.ts`
3. Add to `locales` object in `lib/i18n/index.ts`
4. Create prompt entries in all files under `lib/i18n/prompts/`
5. Update `Language` type in `types.ts`
6. Update Zod schemas in `app/api/story/route.ts` and `app/api/tts/route.ts`
7. Add TTS voice selection in `app/api/tts/route.ts`

### Adding a New Character Option

1. Add type to `types.ts` (e.g., new `SkinTone` type)
2. Update `CharacterCustomization` type in `types.ts`
3. Update `app/components/story/CharacterWizard.tsx` UI
4. Update `ai/llm/systemPrompt.ts` to incorporate into character description
5. Update Zod schema in `app/api/story/route.ts` for validation
6. Add translations in `lib/i18n/locales/*.ts`

### Adding a New API Endpoint

1. Create `app/api/{name}/route.ts` with Zod request validation
2. Add service client in `services/{name}Client.ts`
3. Add tests for the new service client
4. Handle errors following existing pattern (400 for validation, 500 for server errors)

---

## Trust These Instructions
