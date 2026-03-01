import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { apiKey, platform, contentType, topic, context, brandVoice, niche, targetAudience } =
      await req.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'Claude API key is required. Add it in Settings.' }, { status: 400 });
    }

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required.' }, { status: 400 });
    }

    const client = new Anthropic({ apiKey });

    const profileContext = [
      niche && `Niche/Industry: ${niche}`,
      targetAudience && `Target Audience: ${targetAudience}`,
      brandVoice && `Brand Voice: ${brandVoice}`,
    ]
      .filter(Boolean)
      .join('\n');

    const systemPrompt = `You are an elite social media content strategist who creates viral, high-performing content for TikTok and X (Twitter). You understand platform algorithms, audience psychology, and what makes content spread.

${profileContext ? `\nCreator Profile:\n${profileContext}\n` : ''}
Always be specific, actionable, and platform-native. No generic advice. Write content that sounds human, not AI-generated.`;

    let userPrompt = '';

    switch (contentType) {
      case 'script':
        userPrompt = `Write a TikTok script about: "${topic}"
${context ? `\nAdditional context: ${context}` : ''}

Structure it exactly like this:

**HOOK (0-3 seconds)**
[The opening line/visual that stops the scroll. Must create curiosity or tension.]

**SETUP (3-10 seconds)**
[Build context quickly. Why should they care?]

**BODY (10-45 seconds)**
[The main content. Deliver value in punchy, fast-paced segments. Include specific talking points with timestamps.]

**CTA (last 3-5 seconds)**
[Clear call to action. Follow, comment prompt, or share trigger.]

---

**RETENTION TIPS:**
- Visual/editing suggestions
- Sound/music recommendations
- On-screen text overlay ideas

**ESTIMATED DURATION:** [length]
**BEST POSTING TIME:** [recommendation]`;
        break;

      case 'thread':
        userPrompt = `Write an X/Twitter thread about: "${topic}"
${context ? `\nAdditional context: ${context}` : ''}

Format each tweet clearly numbered. Requirements:
- Tweet 1: Powerful hook that makes people want to read more. Use a bold claim, surprising stat, or contrarian take.
- Tweets 2-7: Each tweet delivers one key insight. Each should stand alone as valuable. Keep under 280 chars each.
- Final tweet: CTA (follow, repost, bookmark prompt) + callback to tweet 1.

After the thread, add:
**ENGAGEMENT STRATEGY:**
- Best time to post
- Reply strategy for first hour
- Quote-tweet bait ideas`;
        break;

      case 'post':
        userPrompt = `Write 5 X/Twitter post variations about: "${topic}"
${context ? `\nAdditional context: ${context}` : ''}

Each post must be under 280 characters. Create different styles:
1. **Hot Take** — contrarian or bold opinion
2. **Insight** — teach something valuable in one tweet
3. **Story** — micro-story or personal angle
4. **Question** — engagement bait that sparks replies
5. **List/Thread Starter** — could expand into a thread

For each, include the character count and a one-line strategy note.`;
        break;

      case 'hook':
        userPrompt = `Generate 10 scroll-stopping hooks for ${platform === 'x' ? 'X/Twitter' : 'TikTok'} content about: "${topic}"
${context ? `\nAdditional context: ${context}` : ''}

For each hook:
- Write the exact hook text
- Rate its scroll-stop power (1-10)
- Explain WHY it works (psychology trigger)
- Suggest the format (talking head, text overlay, greenscreen, etc.)

Organize from strongest to weakest. Focus on curiosity gaps, pattern interrupts, and emotional triggers.`;
        break;

      case 'concept':
        userPrompt = `Create a detailed video concept for TikTok about: "${topic}"
${context ? `\nAdditional context: ${context}` : ''}

Include:
**TITLE:** [working title]
**PREMISE:** [one-line concept]
**FORMAT:** [talking head / skit / tutorial / storytime / greenscreen / etc.]
**DURATION:** [recommended length]

**SHOT LIST:**
1. [Shot description + duration]
2. [Shot description + duration]
...

**AUDIO:**
- Trending sound recommendation (or original audio approach)
- Music mood/genre

**VISUAL ELEMENTS:**
- On-screen text overlays
- Props or backgrounds needed
- Transitions

**HASHTAG STRATEGY:**
- 3-5 relevant hashtags

**WHY THIS WORKS:**
- Algorithm factors this leverages
- Audience psychology at play`;
        break;

      default:
        userPrompt = `Create content about "${topic}" for ${platform}. ${context || ''}`;
    }

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6-20250514',
      max_tokens: 3000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    return NextResponse.json({ content: text });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Generation failed';
    const status = message.includes('authentication') || message.includes('API key') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
