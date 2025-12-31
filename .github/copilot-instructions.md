# Copilot Coding Agent Instructions for Story AI

## Repository Overview

Story AI is an AI-powered interactive children's storytelling web application. It creates personalized adventures using OpenAI's GPT-4o-mini for narrative generation and DALL-E 2 for watercolor-style illustrations. Children follow the Hero's Journey through 12 story beats, making choices that shape their adventure.

**Project Type:** Next.js 16.1.1 web application (App Router)  
**Languages:** TypeScript 5.x  
**Frameworks:** React 19.2.3, Tailwind CSS 4.x  
**Runtime:** Node.js 20+  
**Repository Size:** Small-Medium (~30 source files)

---

## Build & Validation Commands

### Prerequisites

- Node.js 20 or higher required
- npm 10.x or higher

### Essential Commands

| Command                                       | Purpose                      | Notes                                                  |
| --------------------------------------------- | ---------------------------- | ------------------------------------------------------ |
| `npm install`                                 | Install dependencies         | Always run first after clone or dependency changes     |
| `OPENAI_API_KEY=sk-placeholder npm run build` | Production build             | **CRITICAL:** Build fails without `OPENAI_API_KEY` set |
| `npm run lint`                                | Run ESLint                   | May have pre-existing warnings (see Known Issues)      |
| `npm run test`                                | Run Vitest in watch mode     | Interactive test runner                                |
| `npm run test:run`                            | Run tests once               | For CI/CD pipelines                                    |
| `npm run test:coverage`                       | Run tests with coverage      | Generates coverage report                              |
| `npm run dev`                                 | Start dev server (port 3000) | Requires valid OpenAI key for full functionality       |
| `npm run start`                               | Start production server      | Run after successful build                             |

### Build Sequence

1. `npm install` - Install all dependencies
2. `npm run test:run` - Run tests to verify code integrity
3. `OPENAI_API_KEY=sk-placeholder npm run build` - Build the application

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
| `vitest.smoke.test.ts`                          | Basic smoke tests                                             |

### Running Tests

```bash
npm run test          # Watch mode (development)
npm run test:run      # Single run (CI)
npm run test:coverage # With coverage report
```

---

## Known Issues (Pre-existing)

The repository may have pre-existing lint warnings. These do **not** block the build:

- Anonymous default export warnings
- Unused import warnings
- React hooks order warnings

---

## Project Structure

```
story-ai/
├── app/                          # Next.js App Router directory
│   ├── api/story/route.ts        # POST /api/story - story generation endpoint
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
│   │   └── index.ts              # DALL-E 2 image generation
│   └── types.ts                  # AI message types
├── services/
│   └── storyClient.ts            # Frontend API client
├── docs/
│   └── internal/                 # Internal documentation and task files
├── types.ts                      # Core shared types
├── vitest.config.ts              # Vitest configuration
├── vitest.setup.ts               # Test setup (jsdom)
└── vitest.smoke.test.ts          # Smoke tests
```

### Key Files

| File                                       | Purpose                                            |
| ------------------------------------------ | -------------------------------------------------- |
| `app/page.tsx`                             | Main entry point, uses `useStoryGame` hook         |
| `app/api/story/route.ts`                   | API endpoint, validates with Zod, calls `runStory` |
| `ai/story.ts`                              | Orchestrates LLM + image generation                |
| `ai/llm/systemPrompt.ts`                   | Hero's Journey prompt with character customization |
| `types.ts`                                 | Core types used across frontend and backend        |
| `app/components/story/StartScreen.tsx`     | Name, gender, language, theme, character selection |
| `app/components/story/CharacterWizard.tsx` | Character customization UI (hair, outfit, colors)  |

### Path Aliases

TypeScript paths configured: `@/*` → `./*` (from project root)

---

## Core Types

```typescript
// types.ts
export type Gender = 'boy' | 'girl';
export type Language = 'th' | 'en';
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

| File                 | Purpose                                                        |
| -------------------- | -------------------------------------------------------------- |
| `eslint.config.mjs`  | ESLint flat config with Next.js core-web-vitals and TypeScript |
| `tsconfig.json`      | TypeScript strict mode, bundler resolution, `@/*` path alias   |
| `next.config.ts`     | Image remote patterns for DALL-E blob storage                  |
| `postcss.config.mjs` | Tailwind CSS 4 via `@tailwindcss/postcss`                      |
| `vitest.config.ts`   | Vitest configuration with React plugin and jsdom               |
| `vitest.setup.ts`    | Test setup for jest-dom matchers                               |
| `.gitignore`         | Standard Next.js ignores plus `.env*` files                    |

---

## Environment Variables

| Variable                  | Required                  | Description                                        |
| ------------------------- | ------------------------- | -------------------------------------------------- |
| `OPENAI_API_KEY`          | Yes (for build & runtime) | OpenAI API key for GPT-4o-mini and DALL-E 2        |
| `ENABLE_IMAGE_GENERATION` | No                        | Set to `false` to disable DALL-E (default: `true`) |

---

## Feature Summary

| Feature                   | Status         | Key Files                            |
| ------------------------- | -------------- | ------------------------------------ |
| Hero's Journey (12 beats) | ✅ Implemented | `systemPrompt.ts`                    |
| Character Customization   | ✅ Implemented | `CharacterWizard.tsx`, `types.ts`    |
| 5 Story Themes            | ✅ Implemented | `systemPrompt.ts`, `StartScreen.tsx` |
| Bilingual (EN/TH)         | ✅ Implemented | `systemPrompt.ts`, all UI components |
| PDF Export                | ✅ Implemented | `ExportPdfButton.tsx`                |
| Text-to-Speech            | ✅ Implemented | `SpeakButton.tsx`                    |
| Story Transitions         | ✅ Implemented | `TransitionScreen.tsx`               |
| Story Carousel            | ✅ Implemented | `StoryCarousel.tsx`                  |
| LocalStorage Persistence  | ✅ Implemented | `useLocalStorage.ts`                 |

---

## Development Notes

1. **Client vs Server Components**: `app/page.tsx` and components in `app/components/story/` use `'use client'` directive
2. **Zod Validation**: API route uses Zod for request validation with strict schema
3. **Image Optimization**: Uses `next/image` with remote patterns for OpenAI blob storage
4. **Character Consistency**: Character description is injected into system prompt and must remain identical across all image prompts
5. **Theme Integration**: Each theme has both narrative description (for story) and visual style (for images)

---

## CI/CD

**No GitHub Actions workflows exist yet.** Recommended to add:

- Build validation on push
- Test execution on PR
- ESLint checks

---

## Trust These Instructions

These instructions have been validated by analyzing the actual repository structure and code as of December 31, 2024. If a command fails or behavior differs from what is documented, first verify the command exactly as written before exploring alternatives.
