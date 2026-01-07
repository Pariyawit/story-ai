# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Story AI is an AI-powered interactive children's storytelling application that creates personalized adventures using OpenAI's GPT-4o-mini and DALL-E 2. Children follow the Hero's Journey narrative structure through exactly 12 story beats, making choices that shape their unique adventure with watercolor-style illustrations.

**Tech Stack:**

- Next.js 16.1.1 (App Router)
- React 19.2.3
- TypeScript 5.x (strict mode)
- Tailwind CSS 4.x
- Zod for runtime validation
- Vitest for testing

## Essential Commands

```bash
# Development
pnpm run dev                   # Start dev server at localhost:3000

# Building (CRITICAL: Requires OPENAI_API_KEY)
OPENAI_API_KEY=sk-placeholder pnpm run build  # Production build
pnpm run start                 # Start production server after build

# Testing
pnpm run test                  # Run tests in watch mode
pnpm run test:run              # Run tests once
pnpm run test:coverage         # Run tests with coverage report

# Code Quality & Formatting
pnpm run lint                  # Run ESLint
pnpm run lint:fix              # Auto-fix linting errors
pnpm run format                # Format all files with Prettier
pnpm run format:check          # Check formatting without making changes
pnpm run typecheck             # TypeScript type checking
pnpm run check                 # Run all checks (typecheck + lint + format)
```

**Build Warning:** The build command **MUST** have `OPENAI_API_KEY` set (even with placeholder value), otherwise build fails with "Missing credentials" error.

## Code Quality Standards

This project enforces strict code quality standards using automated tools:

### Linting & Formatting

- **Prettier**: Code formatting (120-char line limit, 2 spaces, single quotes including JSX, LF endings)
- **ESLint**: Code quality rules (TypeScript, React best practices, import ordering)
- **EditorConfig**: Cross-editor consistency

### Pre-commit Hooks (Husky)

All commits automatically trigger:

1. **Pre-commit hook**: Lints and formats staged files
2. **Commit-msg hook**: Validates conventional commit format

### Conventional Commits

All commit messages MUST follow this format:

```
<type>: <subject>

[optional body]

[optional footer]
```

**Allowed types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `revert`, `ci`, `build`

**Examples**:

- ✅ `feat: add user authentication`
- ✅ `fix: resolve memory leak in image loader`
- ❌ `Add feature` (missing type)
- ❌ `Feat: add feature` (uppercase type)

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## Architecture Overview

### Three-Layer Architecture

1. **Frontend Layer** (`app/`)
   - Client-side React components with `'use client'` directive
   - Custom hooks for state management (`useStoryGame`, `useLocalStorage`)
   - API client in `services/storyClient.ts`

2. **API Layer** (`app/api/`)
   - Next.js API routes (App Router convention)
   - Zod validation for request/response
   - Routes are server-side by default

3. **AI Integration Layer** (`ai/`)
   - OpenAI client wrapper
   - Story orchestration and prompt engineering
   - Sequential flow: LLM → Image Generation

### Core Data Flow

```
User Input → useStoryGame hook → postStory() → /api/story route
                                                      ↓ (Zod validation)
                                                  runStory()
                                                      ↓
                                          ┌───────────┴───────────┐
                                          ↓                       ↓
                                    runLLM()              generateImage()
                                  (GPT-4o-mini)            (DALL-E 2)
                                          ↓                       ↓
                                          └───────────┬───────────┘
                                                      ↓
                                              StoryBeat Response
```

### Hero's Journey Implementation

The system enforces a strict 12-step narrative structure (defined in `ai/llm/systemPrompt.ts`):

1. **Ordinary World** (The Dream)
2. **Call to Adventure**
3. **Refusal of the Call**
4. **Meeting the Mentor**
5. **Crossing the Threshold**
6. **Tests, Allies, Enemies**
7. **Approach to the Inmost Cave**
8. **The Ordeal**
9. **Reward** (Seizing the Sword)
10. **The Road Back**
11. **Resurrection**
12. **Return with the Elixir** (ending - no choices)

**Critical:** Beat 12 returns `choices: []` to trigger the END state celebration screen.

### State Management Pattern

The `useStoryGame` hook manages three game states:

- `START`: Name input screen (collects name, gender, language, theme)
- `TRANSITION`: Animated transition between story beats
- `STORY`: Main story screen (current beat display + choice buttons)

**Important State Details:**

- `history`: Array of completed StoryBeat objects (with `selected` field)
- `currentBeat`: Current StoryBeat being displayed (no `selected` field yet)
- `currentPage`: Computed as `history.length + 1` (1-based indexing for UI)
- Theme preference persists in localStorage across restarts

### Multilingual Support

The app supports English (`en`), Thai (`th`), and Singlish (`singlish`):

- Language selection in StartScreen
- System prompt adapts based on language
- All UI text (buttons, labels, celebration messages) localized
- Choice validation rules language-specific
- Singlish uses predominantly English with subtle Singapore English expressions ("lah", "leh", "shiok", etc.)

### Theme System

Five themes available (`StoryTheme` type):

- `enchanted_forest`: Magical forest with talking animals
- `space_adventure`: Outer space with friendly aliens
- `underwater_kingdom`: Ocean depths with mermaids
- `dinosaur_land`: Prehistoric world with gentle dinosaurs
- `fairy_tale_castle`: Medieval kingdom with dragons

Themes affect:

- System prompt instructions (setting, atmosphere)
- Image generation style prompts
- Visual DNA for consistent character/world rendering

### Image Generation Strategy

**Current Implementation (Sequential):**

```typescript
// ai/story.ts
const result = await runLLM({ messages }); // 2-5 seconds
const imageUrl = await generateImage({ prompt }); // 10-20 seconds
return { ...content, imageUrl }; // Total: 12-25 seconds
```

**Toggle:** Set `ENABLE_IMAGE_GENERATION=false` to disable DALL-E calls (89% cost reduction).

**Performance Logging:** The code includes `[PERF]` console logs to track LLM and image generation timing.

### Placeholder Choice Validation

`ai/story.ts` includes validation to detect LLM hallucination/placeholder patterns:

```typescript
PLACEHOLDER_PATTERNS = [
  /^choice\s*[a-c]$/i,
  /^option\s*[a-c]$/i,
  // ... more patterns
];
```

This prevents generic "Choice A", "Choice B" responses and logs warnings when detected.

### Transition System

When a user selects a choice, the system can show animated transition texts:

- Defined in `choicesWithTransition` field (3-4 short sentences)
- Bridges current scene to next scene
- Creates smoother narrative flow
- Displays in TRANSITION game state

### END State Celebration

When `currentBeat.choices.length === 0`:

1. **StoryScreen** switches to summary view mode
2. Shows two view modes:
   - **Carousel View**: Paginated gallery of all story beats with images
   - **Full Story View**: Complete text of entire journey
3. Displays celebration message (localized)
4. Shows "Export PDF" button (jsPDF integration)
5. Shows "The End - Start New Adventure" button

**Export Feature:** Uses `jsPDF` to generate a PDF with all story beats, images, and player name.

## File Organization

### Core Types (`types.ts`)

All shared types are centralized:

```typescript
StoryBeat; // Single story beat with text, choices, image
Gender; // 'boy' | 'girl'
Language; // 'th' | 'en'
StoryTheme; // Five theme options
ChoiceWithTransition; // Choice text + transition sentences
```

### Component Architecture

**Common Components** (`app/components/common/`):

- `Button.tsx`: Supports `primary` and `gradient` variants, custom gradient colors
- `Card.tsx`: Glass morphism style (white/80 + backdrop blur)
- `Input.tsx`: Accessible form inputs with sr-only labels
- `LoadingSpinner.tsx`: Animated loading indicator

**Story Components** (`app/components/story/`):

- `StartScreen.tsx`: Name + gender + language + theme selection
- `StoryScreen.tsx`: Main story display with responsive layout
  - Split view on desktop: Image left, Story+Choices right
  - Stacked view on mobile
  - END state: Summary view with carousel/full text toggle
- `StoryImage.tsx`: 5:4 aspect ratio, Next.js Image optimization
- `StoryText.tsx`: Story text display with loading state
- `ChoiceButtons.tsx`: Renders choice buttons OR END celebration
- `StoryCarousel.tsx`: Swipeable gallery for story beat navigation
- `TransitionScreen.tsx`: Animated text display between beats
- `ExportPdfButton.tsx`: PDF generation functionality

### API Route Pattern

```typescript
// app/api/story/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  const validatedData = requestSchema.parse(body); // Zod validation
  const { name, history, gender, language, theme } = validatedData;
  const data = await runStory(name, history, gender, language, theme);
  return Response.json(data, { status: 200 });
}
```

**Zod Schemas:**

- `choiceWithTransitionSchema`: Validates choice with transition texts
- `storyBeatSchema`: Validates StoryBeat structure
- `requestSchema`: Validates POST body (name, history, gender, language, theme)

### Design System

**Colors:**

- Primary gradient: Purple (#9333EA) → Pink (#EC4899)
- Background: Yellow (#FFFBEB) → Pink (#FCE7F3) → Purple (#FAF5FF)
- Choice button gradients: Pink-Rose, Blue-Cyan, Purple-Violet (cycling)

**Typography:**

- Geist Sans (primary), Geist Mono (code)
- Story text: `text-lg` (18px) for readability
- Kid-friendly watercolor aesthetic

**Responsive Breakpoints:**

- Mobile-first approach
- `md:` (768px): Two-column layout (image left, content right)
- `lg:` (1024px): Increased padding

## Critical Implementation Details

### 1. Model Names

**MUST USE:** `gpt-4o-mini` (NOT `gpt-5-mini` which doesn't exist)

- Configured in `ai/llm/index.ts`
- Temperature: 0.8 for creative storytelling

### 2. Image Size

DALL-E 2 uses `512x512` (not 1024x1024) for faster generation and lower cost.

### 3. System Prompt Structure

The system prompt (`ai/llm/systemPrompt.ts`) is dynamically constructed:

- Language-specific instructions
- Theme-specific setting descriptions
- Gender-specific character descriptions
- Strict JSON format enforcement
- Visual DNA for consistent image generation

**Critical Prompt Rules:**

- Character description MUST remain identical across all 12 beats
- Every response MUST include `imagePrompt` field
- Beat 12 MUST return empty `choices` array
- Forward motion required (no "thinking" sentences, only ACTION)

### 4. Path Alias

TypeScript configured with `@/*` → `./` mapping. Always use:

```typescript
import { StoryBeat } from '@/types'; // Correct
import { StoryBeat } from '../types'; // Avoid
```

### 5. Performance Considerations

Current bottleneck: Sequential LLM + Image generation (12-25 seconds per beat)

**Future optimization opportunity:** Separate image generation to background/separate endpoint.

### 6. Error Handling

- LLM errors: Continue without failing, log to console
- Image generation errors: Return `imageUrl: undefined`, continue story
- Zod validation errors: Return 400 with validation details
- Generic errors: Return 500 with error message

## Testing

Vitest configured with:

- `jsdom` environment for React component testing
- `@testing-library/react` and `@testing-library/jest-dom`
- Path alias `@/*` support
- Coverage with v8 provider

**Run tests:**

```bash
pnpm run test              # Watch mode
pnpm run test:run          # Single run
pnpm run test:coverage     # With coverage report
```

Test files: `**/*.{test,spec}.{ts,tsx}`

## Environment Configuration

Required `.env` file:

```bash
OPENAI_API_KEY=sk-...                    # Required for build & runtime
ENABLE_IMAGE_GENERATION=true             # Optional (default: true)
```

**Cost Analysis:**

- With images: ~$0.27 per complete story (12 beats)
- Without images: ~$0.03 per complete story
- LLM: ~$0.0025 per beat (GPT-4o-mini)
- Image: ~$0.02 per image (DALL-E 2 512x512)

## Common Patterns

### Adding a New Story Theme

1. Update `types.ts`: Add theme to `StoryTheme` union type
2. Update `ai/llm/systemPrompt.ts`:
   - Add theme to `getThemeDescription()` (en + th)
   - Add theme to `getThemeStyle()` (visual elements)
3. Update `app/components/story/StartScreen.tsx`: Add theme option button
4. Update Zod schema in `app/api/story/route.ts`: Add to theme enum

### Modifying Hero's Journey Steps

The 12-step structure is hardcoded in the system prompt. To change:

1. Update `ai/llm/systemPrompt.ts`: Modify NARRATIVE ARCH section
2. Update any UI showing page count (e.g., "Page X/12")
3. Consider adjusting max character limits per beat

### Adding New Language Support

1. Update `types.ts`: Add language code to `Language` type
2. Update `ai/llm/systemPrompt.ts`:
   - Add to `getLanguageInstruction()`
   - Add to `getChoiceRules()`
   - Add to `getJsonFormatExample()`
   - Update `getThemeDescription()` if translations needed
3. Update all UI components with localized strings
4. Update Zod schemas in API routes (`app/api/story/route.ts`, `app/api/tts/route.ts`)
5. Configure TTS voice selection if needed (`app/api/tts/route.ts`)

## Known Issues

Pre-existing lint warnings (non-critical, do not block commits):

- `ai/llm/index.ts`: console.log warning (used for debugging)
- `ai/story.ts`: Multiple console.log warnings and max-line-length warnings
- `app/components/story/*.tsx`: Array index as key warnings (safe in this context)
- `app/page.tsx`: setState in effect warning (intentional for fade animation, disabled)

These warnings are configured to warn (not error) and do not affect functionality. They are either intentional (console logs for debugging, animation effects) or safe in the current context (array indices for static content).

## Debugging Tips

1. **Performance issues:** Check server console for `[PERF]` logs showing LLM/image timing
2. **LLM returning placeholders:** Check `[WARN]` logs for placeholder choice detection
3. **Image not loading:** Verify `next.config.ts` has correct DALL-E blob storage hostname
4. **Build fails:** Ensure `OPENAI_API_KEY` is set in environment (even placeholder works)
5. **TypeScript errors:** Verify `@/*` path alias is working in `tsconfig.json`

## Development Workflow

1. Start dev server: `pnpm run dev`
2. Navigate to `http://localhost:3000`
3. Enter name, select gender/language/theme
4. Story generates (watch server console for performance logs)
5. Make choices through 12 beats
6. Test END state celebration and export functionality
7. Click restart to begin new story

**Hot Reload:** Next.js dev server auto-reloads on file changes.

## Meta Tags

Configured in `app/layout.tsx`:

- Title: "Story AI - Interactive Children's Storytelling"
- Description, keywords, authors, OpenGraph metadata included
- Optimized for SEO and social sharing

## Configuration Files

### Code Quality & Formatting

- **`.prettierrc`**: Prettier formatting rules (100-char lines, 2 spaces, LF)
- **`.prettierignore`**: Files excluded from Prettier formatting
- **`eslint.config.mjs`**: ESLint rules (TypeScript, React, import ordering)
- **`.editorconfig`**: Cross-editor consistency (indentation, line endings)
- **`commitlint.config.js`**: Commit message validation rules
- **`.husky/pre-commit`**: Pre-commit hook (lint + format staged files)
- **`.husky/commit-msg`**: Commit message validation hook
- **`.vscode/settings.json`**: VS Code auto-format on save configuration
- **`.vscode/extensions.json`**: Recommended VS Code extensions

### Documentation

- **`CONTRIBUTING.md`**: Comprehensive contributor guide with commit message examples
- **`.github/LINT_SETUP.md`**: Detailed linting and formatting documentation
- **`CLAUDE.md`**: This file - project overview for Claude Code

### Environment & Build

- **`.env`**: Environment variables (OPENAI_API_KEY, ENABLE_IMAGE_GENERATION)
- **`next.config.ts`**: Next.js configuration (image domains, webpack)
- **`tailwind.config.ts`**: Tailwind CSS customization
- **`tsconfig.json`**: TypeScript configuration (strict mode, path aliases)
- **`vitest.config.ts`**: Vitest testing configuration

For detailed setup instructions, see [CONTRIBUTING.md](CONTRIBUTING.md).
