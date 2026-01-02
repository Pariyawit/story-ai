# 🎨 Story AI - Interactive Children's Storytelling

An AI-powered interactive storytelling app for kids that creates personalized adventures using GPT-4o-mini and DALL-E 2. Children follow the Hero's Journey through 12 magical story beats with beautiful watercolor illustrations, making choices that shape their unique adventure.

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black)
![React](https://img.shields.io/badge/React-19.2.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8)
![Vitest](https://img.shields.io/badge/Vitest-4.x-green)

## ✨ Features

### Core Experience

- 🤖 **AI-Powered Stories**: Uses GPT-4o-mini to generate unique, age-appropriate stories
- 🎨 **Watercolor Illustrations**: DALL-E 2 creates dreamy, hand-painted style images for each story beat
- 📖 **Hero's Journey Structure**: 12-step narrative framework for engaging storytelling
- 🎮 **Interactive Choices**: Kids make decisions that shape the story's direction with animated transitions
- 🎉 **Celebration Screen**: Special ending with congratulations message and restart option

### Character & Theme Customization

- 👤 **Character Wizard**: Full character customization with:
  - Hair color (brown, black, blonde, red, blue, pink)
  - Hair style (short, long, curly, braids, ponytail)
  - Outfit style (adventurer, princess, superhero, wizard, explorer)
  - Favorite color influence on outfit
- 🏰 **5 Story Themes**: Enchanted Forest, Space Adventure, Underwater Kingdom, Dinosaur Land, Fairy Tale Castle
- 🌍 **Bilingual Support**: Full English and Thai (ภาษาไทย) language support

### Export & Accessibility

- 📄 **PDF Export**: Download completed stories as beautifully formatted PDF books
- 🔊 **Text-to-Speech**: Listen to story narration (SpeakButton component)
- 📱 **Responsive Design**: Works beautifully on mobile, tablet, and desktop

### Technical Features

- 💾 **Progress Persistence**: LocalStorage saves story history
- ⚙️ **Configurable**: Toggle image generation on/off to manage costs
- 🧪 **Test Coverage**: Vitest + React Testing Library for component testing

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- OpenAI API key with access to GPT-4o-mini and DALL-E 2

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/story-ai.git
cd story-ai
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file in the root directory:

```bash
OPENAI_API_KEY=sk-your-api-key-here
ENABLE_IMAGE_GENERATION=true  # Set to false to disable image generation
```

4. Run the development server:

```bash
pnpm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **UI Library**: React 19.2.3
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x
- **AI Models**:
  - GPT-4o-mini for story generation
  - DALL-E 2 for image generation
- **Validation**: Zod for runtime type checking
- **Testing**: Vitest + React Testing Library
- **PDF Generation**: jsPDF
- **Font**: Geist Sans & Geist Mono

## 📁 Project Structure

```
story-ai/
├── app/
│   ├── components/
│   │   ├── common/               # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── SpeakButton.tsx   # Text-to-speech button
│   │   └── story/                # Story-specific components
│   │       ├── CharacterWizard.tsx    # Character customization UI
│   │       ├── ChoiceButtons.tsx
│   │       ├── ExportPdfButton.tsx    # PDF export functionality
│   │       ├── StartScreen.tsx        # Name, gender, language, theme selection
│   │       ├── StoryCarousel.tsx      # Image carousel for story review
│   │       ├── StoryImage.tsx
│   │       ├── StoryScreen.tsx
│   │       ├── StoryText.tsx
│   │       └── TransitionScreen.tsx   # Animated choice transitions
│   ├── hooks/
│   │   ├── useStoryGame.ts
│   │   └── useLocalStorage.ts
│   ├── api/
│   │   └── story/
│   │       └── route.ts          # Story generation API endpoint
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── ai/
│   ├── llm/
│   │   ├── index.ts              # LLM client
│   │   └── systemPrompt.ts       # Hero's Journey prompt with character support
│   ├── generateImage/
│   │   └── index.ts              # DALL-E 2 client
│   ├── story.ts                  # Story orchestration
│   ├── story.test.ts             # Story logic tests
│   ├── types.ts                  # AI message types
│   └── ai.ts                     # OpenAI client
├── services/
│   └── storyClient.ts            # API client
├── docs/
│   └── internal/                 # Internal documentation and task tracking
├── types.ts                      # Core types (StoryBeat, CharacterCustomization, etc.)
├── vitest.config.ts              # Vitest configuration
├── vitest.setup.ts               # Test setup
└── vitest.smoke.test.ts          # Smoke tests
```

## 🎮 How It Works

### Story Generation Flow

1. **Character Setup**: Child enters name, selects gender, language, theme, and customizes character
2. **LLM Call**: GPT-4o-mini generates story text + choices + transitions + image prompt
3. **Image Generation**: DALL-E 2 creates watercolor illustration with consistent character design
4. **Transition Animation**: Selected choice triggers animated transition screen
5. **User Choice**: Child selects from 3 story choices
6. **Repeat**: Steps 2-5 for 12 beats (Hero's Journey)
7. **Celebration**: Special ending screen with PDF export option

### Hero's Journey Structure (12 Beats)

1. Ordinary World (The Dream)
2. Call to Adventure
3. Refusal of the Call
4. Meeting the Mentor
5. Crossing the Threshold
6. Tests, Allies, Enemies
7. Approach to the Inmost Cave
8. The Ordeal
9. Reward (Seizing the Sword)
10. The Road Back
11. Resurrection
12. Return with the Elixir (ending - no choices)

### Story Themes

| Theme                 | English Setting                              | Thai Setting                        |
| --------------------- | -------------------------------------------- | ----------------------------------- |
| 🌲 Enchanted Forest   | Magical forest with talking animals, fairies | ป่าวิเศษที่มีสัตว์พูดได้ นางฟ้าใจดี |
| 🚀 Space Adventure    | Outer space with planets, aliens, rockets    | อวกาศกว้างใหญ่ มีดาวเคราะห์หลากสี   |
| 🐠 Underwater Kingdom | Ocean with mermaids, dolphins, treasures     | ใต้ท้องมหาสมุทร มีนางเงือก ปะการัง  |
| 🦕 Dinosaur Land      | Prehistoric world with gentle dinosaurs      | โลกยุคก่อนประวัติศาสตร์ มีไดโนเสาร์ |
| 🏰 Fairy Tale Castle  | Magical kingdom with castles, dragons        | อาณาจักรมหัศจรรย์ มีปราสาท มังกร    |

## ⚙️ Configuration

### Environment Variables

```bash
# Required
OPENAI_API_KEY=sk-...

# Optional (defaults shown)
ENABLE_IMAGE_GENERATION=true  # Set to false to disable images and reduce cost
```

### Cost Optimization

**With Images Enabled** (default):

- LLM: ~$0.03 per story (12 beats)
- Images: ~$0.24 per story (12 images × $0.02)
- **Total: ~$0.27 per story**

**With Images Disabled**:

- LLM: ~$0.03 per story
- Images: $0.00
- **Total: ~$0.03 per story (89% savings)**

To disable images during development:

```bash
ENABLE_IMAGE_GENERATION=false pnpm run dev
```

## 🛠️ Development

### Scripts

```bash
pnpm run dev           # Start development server
pnpm run build         # Production build
pnpm run start         # Start production server
pnpm run lint          # Run ESLint
pnpm run test          # Run Vitest in watch mode
pnpm run test:run      # Run tests once
pnpm run test:coverage # Run tests with coverage report
```

### Testing

The project uses **Vitest** with **React Testing Library** for component testing.

```bash
# Run all tests
pnpm run test

# Run tests once (CI mode)
pnpm run test:run

# Run with coverage
pnpm run test:coverage
```

**Test Files:**

- `ai/story.test.ts` - Story orchestration logic tests
- `app/components/story/StoryScreen.test.tsx` - StoryScreen component tests
- `app/components/story/StoryCarousel.test.tsx` - StoryCarousel component tests
- `app/components/story/ExportPdfButton.test.tsx` - PDF export tests
- `vitest.smoke.test.ts` - Smoke tests

### Performance Logging

The app includes performance metrics in the console:

```
[PERF] Starting LLM call...
[PERF] LLM completed in 2500ms
[PERF] Starting image generation...
[PERF] Image generation completed in 15000ms
[PERF] Total runStory duration: 17500ms (LLM: 2500ms, Image: 15000ms)
```

## 📝 API Routes

### POST `/api/story`

Generate next story beat based on history.

**Request**:

```json
{
  "name": "Alice",
  "gender": "girl",
  "language": "en",
  "theme": "enchanted_forest",
  "character": {
    "hairColor": "blonde",
    "hairStyle": "braids",
    "outfitStyle": "princess",
    "favoriteColor": "pink"
  },
  "history": [
    {
      "storyText": "Alice found herself in a magical garden...",
      "choices": ["Explore the forest", "Follow the river", "Climb the mountain"],
      "choicesWithTransition": [
        { "text": "Explore the forest", "transition": ["She walked into the woods...", "The trees sparkled..."] }
      ],
      "imagePrompt": "A young girl with braided blonde hair...",
      "imageUrl": "https://...",
      "selected": "Explore the forest"
    }
  ]
}
```

**Response**:

```json
{
  "storyText": "Alice ventured into the enchanted forest...",
  "choices": ["Talk to the owl", "Pick the glowing flower", "Cross the bridge"],
  "choicesWithTransition": [
    { "text": "Talk to the owl", "transition": ["She approached the wise owl...", "Its eyes sparkled..."] }
  ],
  "imagePrompt": "A young girl with braided blonde hair wearing a pink princess dress talking to a wise owl...",
  "imageUrl": "https://..."
}
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables:
   - `OPENAI_API_KEY`
   - `ENABLE_IMAGE_GENERATION`
4. Deploy

### Other Platforms

Build the production bundle:

```bash
pnpm run build
pnpm run start
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **OpenAI** for GPT-4o-mini and DALL-E 2
- **Vercel** for Next.js framework
- **Joseph Campbell** for the Hero's Journey framework

## 📧 Contact

Pariyawit J - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/story-ai](https://github.com/yourusername/story-ai)

---

Built with ❤️ using Next.js, React, and OpenAI
