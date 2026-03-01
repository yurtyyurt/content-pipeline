# Content Pipeline

AI-powered content research, creation, and pipeline management for TikTok and X.

## Features

- **Research** — AI-driven trend analysis, content ideas, hashtag strategies, and gap identification for your niche
- **Create** — Generate TikTok scripts, X threads, posts, hooks, and video concepts with platform-optimized AI prompts
- **Pipeline** — Kanban board to manage content from idea through publication with drag-and-drop
- **Competitors** — Track competitor accounts, input their top content, and get AI-powered competitive analysis
- **Settings** — Configure your Claude API key, niche, brand voice, and target audience for personalized output

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Claude API (Anthropic SDK)
- localStorage for data persistence

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configuration

1. Go to **Settings** in the app
2. Add your Claude API key (get one at [console.anthropic.com](https://console.anthropic.com))
3. Set your niche, target audience, and brand voice for better AI output
4. Optionally add an X API bearer token for enhanced trend data

## Deploy

Deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yurtyyurt/content-pipeline)

Or any platform that supports Next.js.

## License

MIT
