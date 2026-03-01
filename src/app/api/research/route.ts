import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { apiKey, topic, platform, niche, targetAudience } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'Claude API key is required. Add it in Settings.' }, { status: 400 });
    }

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required.' }, { status: 400 });
    }

    const client = new Anthropic({ apiKey });

    const platformLabel =
      platform === 'both'
        ? 'TikTok and X/Twitter'
        : platform === 'x'
          ? 'X/Twitter'
          : 'TikTok';

    const systemPrompt = `You are a social media trend analyst and content strategist. You have deep expertise in what performs well on TikTok and X/Twitter, including algorithm patterns, viral formats, and audience behavior.

Provide specific, actionable intelligence — not generic advice. Reference real content patterns, formats, and strategies that are currently effective.${niche ? `\nThe creator's niche: ${niche}` : ''}${targetAudience ? `\nTarget audience: ${targetAudience}` : ''}`;

    const userPrompt = `Research content opportunities about "${topic}" for ${platformLabel}.

Provide a comprehensive analysis:

## Trending Angles
5-8 specific angles on this topic that are gaining traction. For each, explain why it's trending and how to approach it.

## Viral Formats
3-5 content formats currently performing well for this topic on ${platformLabel}. Be specific about the format structure (not just "talking head" — describe the exact pattern).

## Content Ideas
5 ready-to-develop content ideas. For each include:
- Working title
- Hook line
- Key angle/twist that makes it unique
- Platform: ${platformLabel}

## Hashtag Strategy
- 5 high-volume hashtags (broad reach)
- 5 niche hashtags (targeted reach)
- 3 trending hashtags related to this topic

## Algorithm Tips
Platform-specific advice for maximizing reach with this topic on ${platformLabel}. Include posting time recommendations, engagement strategies, and format preferences.

## Content Gaps
3 underserved angles on this topic that creators aren't covering yet — these are your biggest opportunities.`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6-20250514',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    return NextResponse.json({ content: text });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Research failed';
    const status = message.includes('authentication') || message.includes('API key') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
