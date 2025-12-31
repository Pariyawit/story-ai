# 🎨 Story AI - Interactive Children's Storytelling

An AI-powered interactive storytelling app for kids that creates personalized adventures using GPT-4o-mini and DALL-E 2. Children follow the Hero's Journey through 12 magical story beats with beautiful watercolor illustrations, making choices that shape their unique adventure.

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black)
![React](https://img.shields.io/badge/React-19.2.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8)

## ✨ Features

- 🤖 **AI-Powered Stories**: Uses GPT-4o-mini to generate unique, age-appropriate stories
- 🎨 **Watercolor Illustrations**: DALL-E 2 creates dreamy, hand-painted style images for each story beat
- 📖 **Hero's Journey Structure**: 12-step narrative framework for engaging storytelling
- 🎮 **Interactive Choices**: Kids make decisions that shape the story's direction
- 🎉 **Celebration Screen**: Special ending with congratulations message and restart option
- 📱 **Responsive Design**: Works beautifully on mobile, tablet, and desktop
- 💾 **Progress Persistence**: LocalStorage saves story history (optional)
- ⚙️ **Configurable**: Toggle image generation on/off to manage costs

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
npm install
```

3. Create a `.env` file in the root directory:

```bash
OPENAI_API_KEY=sk-your-api-key-here
ENABLE_IMAGE_GENERATION=true  # Set to false to disable image generation
```

4. Run the development server:

```bash
npm run dev
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
- **Font**: Geist Sans & Geist Mono

## 📁 Project Structure

```
story-ai/
├── app/
│   ├── components/
│   │   ├── common/           # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   └── story/            # Story-specific components
│   │       ├── StartScreen.tsx
│   │       ├── StoryScreen.tsx
│   │       ├── StoryImage.tsx
│   │       ├── StoryText.tsx
│   │       └── ChoiceButtons.tsx
│   ├── hooks/                # Custom React hooks
│   │   ├── useStoryGame.ts
│   │   └── useLocalStorage.ts
│   ├── api/
│   │   └── story/
│   │       └── route.ts      # Story generation API endpoint
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── ai/
│   ├── llm/
│   │   ├── index.ts          # LLM client
│   │   └── systemPrompt.ts   # Hero's Journey prompt
│   ├── generateImage/
│   │   └── index.ts          # DALL-E 2 client
│   ├── story.ts              # Story orchestration
│   └── ai.ts                 # OpenAI client
├── services/
│   └── storyClient.ts        # API client
├── types.ts
└── README.md
```

## 🎮 How It Works

### Story Generation Flow

1. **User Input**: Child enters their name
2. **LLM Call**: GPT-4o-mini generates story text + choices + image prompt
3. **Image Generation**: DALL-E 2 creates watercolor illustration (optional)
4. **User Choice**: Child selects from 3 choices
5. **Repeat**: Steps 2-4 for 12 beats (Hero's Journey)
6. **Celebration**: Special ending screen with restart option

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
ENABLE_IMAGE_GENERATION=false npm run dev
```

## 🎨 Design System

### Colors

- **Primary**: Purple (#9333EA) to Pink (#EC4899) gradient
- **Background**: Yellow (#FFFBEB) → Pink (#FCE7F3) → Purple (#FAF5FF)
- **Accent**: Rose, Blue, Cyan gradients for choice buttons

### Typography

- **Font Family**: Geist Sans (primary), Geist Mono (code)
- **Story Text**: lg (18px) for readability
- **Choices**: lg (18px) bold

### Components

- **Buttons**: Rounded-3xl with gradient backgrounds
- **Cards**: Glass morphism (white/80 + backdrop blur)
- **Images**: 5:4 aspect ratio, rounded-3xl
- **Responsive**: Mobile-first, flex layouts

## 🛠️ Development

### Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Performance Logging

The app includes performance metrics in the console:

```
[PERF] Starting LLM call...
[PERF] LLM completed in 2500ms
[PERF] Starting image generation...
[PERF] Image generation completed in 15000ms
[PERF] Total runStory duration: 17500ms (LLM: 2500ms, Image: 15000ms)
```

## 🐛 Known Issues & Solutions

### Issue: Slow API Responses (~30 seconds)

**Cause**: Sequential LLM + image generation blocking the response

**Solution**: Already implemented performance logging. Future optimization:

- Separate image generation endpoint
- Stream LLM response for progressive rendering
- Background image generation

### Issue: Model Error

**Fixed**: Changed from `gpt-5-mini` (invalid) to `gpt-4o-mini` (correct)

## 📝 API Routes

### POST `/api/story`

Generate next story beat based on history.

**Request**:

```json
{
  "name": "Alice",
  "history": [
    {
      "storyText": "Alice found herself in a magical garden...",
      "choices": ["Explore the forest", "Follow the river", "Climb the mountain"],
      "imagePrompt": "A child in a magical garden...",
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
  "imagePrompt": "A child in an enchanted forest...",
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
npm run build
npm run start
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
