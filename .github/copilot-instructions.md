# Copilot Coding Agent Instructions for Story AI

## Repository Overview

Story AI is an AI-powered interactive children's storytelling web application. It creates personalized adventures using OpenAI's GPT-4o-mini for narrative generation and DALL-E 2 for watercolor-style illustrations. Children follow the Hero's Journey through 12 story beats, making choices that shape their adventure.

**Project Type:** Next.js 16.1.1 web application (App Router)  
**Languages:** TypeScript 5.x  
**Frameworks:** React 19.2.3, Tailwind CSS 4.x  
**Runtime:** Node.js 20+  
**Repository Size:** Small (~20 source files)

---

## Build & Validation Commands

### Prerequisites

- Node.js 20 or higher required
- npm 10.x or higher

### Essential Commands

| Command                                       | Purpose                      | Notes                                                         |
| --------------------------------------------- | ---------------------------- | ------------------------------------------------------------- |
| `npm install`                                 | Install dependencies         | Always run first after clone or dependency changes            |
| `OPENAI_API_KEY=sk-placeholder npm run build` | Production build             | **CRITICAL:** Build fails without `OPENAI_API_KEY` set        |
| `npm run lint`                                | Run ESLint                   | Currently has pre-existing warnings/errors (see Known Issues) |
| `npm run dev`                                 | Start dev server (port 3000) | Requires valid OpenAI key for full functionality              |
| `npm run start`                               | Start production server      | Run after successful build                                    |

### Build Sequence

1. `npm install` - Install all dependencies
2. `OPENAI_API_KEY=sk-placeholder npm run build` - Build the application

**Important:** The build command **MUST** have `OPENAI_API_KEY` environment variable set, even with a placeholder value. Without it, the build fails with:

```
Error: Missing credentials. Please pass an `apiKey`, or set the `OPENAI_API_KEY` environment variable.
```

---

## Known Issues (Pre-existing)

The repository has pre-existing lint errors that are not your responsibility to fix unless your task requires it:

- `ai/llm/index.ts`: Unused import `zodFunction`
- `ai/llm/systemPrompt.ts`: Anonymous default export warning
- `ai/types.ts`: Two `@typescript-eslint/no-explicit-any` errors
- `app/api/story/route.ts`: Unused import `runLLM`
- `app/hooks/useLocalStorage.ts`: React hooks `set-state-in-effect` error

These do **not** block the build.

---

## Project Structure

```
story-ai/
├── app/                      # Next.js App Router directory
│   ├── api/story/route.ts    # POST /api/story - story generation endpoint
│   ├── components/
│   │   ├── common/           # Reusable UI: Button, Card, Input, LoadingSpinner
│   │   └── story/            # Story components: StartScreen, StoryScreen, etc.
│   ├── hooks/                # useStoryGame.ts, useLocalStorage.ts
│   ├── layout.tsx            # Root layout with Geist fonts
│   ├── page.tsx              # Main page (client component)
│   └── globals.css           # Tailwind imports and CSS variables
├── ai/                       # AI integration layer
│   ├── ai.ts                 # OpenAI client instance
│   ├── story.ts              # Story orchestration logic
│   ├── llm/index.ts          # LLM call wrapper
│   ├── llm/systemPrompt.ts   # Hero's Journey prompt
│   ├── generateImage/index.ts # DALL-E 2 image generation
│   └── types.ts              # AI message types
├── services/
│   └── storyClient.ts        # Frontend API client for /api/story
├── types.ts                  # Shared types: StoryBeat, Gender, Language
├── eslint.config.mjs         # ESLint flat config (Next.js + TypeScript)
├── next.config.ts            # Next.js config (image domains)
├── postcss.config.mjs        # PostCSS with Tailwind
├── tsconfig.json             # TypeScript config with path alias @/*
└── package.json              # Scripts and dependencies
```

### Key Files

- **`app/page.tsx`**: Main entry point, uses `useStoryGame` hook
- **`app/api/story/route.ts`**: API endpoint, validates with Zod, calls `runStory`
- **`ai/story.ts`**: Orchestrates LLM + image generation
- **`types.ts`**: Core types used across frontend and backend

### Path Aliases

TypeScript paths configured: `@/*` → `./*` (from project root)

---

## Configuration Files

| File                 | Purpose                                                        |
| -------------------- | -------------------------------------------------------------- |
| `eslint.config.mjs`  | ESLint flat config with Next.js core-web-vitals and TypeScript |
| `tsconfig.json`      | TypeScript strict mode, bundler resolution, `@/*` path alias   |
| `next.config.ts`     | Image remote patterns for DALL-E blob storage                  |
| `postcss.config.mjs` | Tailwind CSS 4 via `@tailwindcss/postcss`                      |
| `.gitignore`         | Standard Next.js ignores plus `.env*` files                    |

---

## Environment Variables

| Variable                  | Required                  | Description                                        |
| ------------------------- | ------------------------- | -------------------------------------------------- |
| `OPENAI_API_KEY`          | Yes (for build & runtime) | OpenAI API key for GPT-4o-mini and DALL-E 2        |
| `ENABLE_IMAGE_GENERATION` | No                        | Set to `false` to disable DALL-E (default: `true`) |

---

## Testing

**No test framework is currently configured.** There are no test files, Jest config, or testing dependencies.

---

## CI/CD

**No GitHub Actions workflows exist.** There is no `.github/workflows` directory.

---

## Development Notes

1. **Client vs Server Components**: `app/page.tsx` and components in `app/components/story/` use `'use client'` directive
2. **Zod Validation**: API route uses Zod for request validation
3. **Image Optimization**: Uses `next/image` with remote patterns for OpenAI blob storage
4. **LocalStorage**: Story progress can be persisted (currently commented out in `useStoryGame.ts`)

---

## Trust These Instructions

These instructions have been validated by running all commands on a clean repository. If a command fails or behavior differs from what is documented, first verify the command exactly as written before exploring alternatives.
