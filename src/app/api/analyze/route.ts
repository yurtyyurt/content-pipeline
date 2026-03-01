import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { apiKey, handle, platform, niche, notes, topContent } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'Claude API key is required. Add it in Settings.' }, { status: 400 });
    }

    if (!handle) {
      return NextResponse.json({ error: 'Competitor handle is required.' }, { status: 400 });
    }

    const client = new Anthropic({ apiKey });

    const platformLabel = platform === 'x' ? 'X/Twitter' : platform === 'tiktok' ? 'TikTok' : 'TikTok and X/Twitter';

    const contentList = topContent
      ?.map((c: { description: string; engagement?: string; date?: string }, i: number) => {
        let line = `${i + 1}. ${c.description}`;
        if (c.engagement) line += ` (Engagement: ${c.engagement})`;
        if (c.date) line += ` [${c.date}]`;
        return line;
      })
      .join('\n') || 'No content data provided';

    const systemPrompt = `You are a competitive intelligence analyst specializing in social media content strategy. You analyze competitor accounts to extract actionable insights.${niche ? `\nAnalyzing within the ${niche} niche.` : ''}`;

    const userPrompt = `Analyze this competitor on ${platformLabel}:

**Handle:** @${handle}
**Notes:** ${notes || 'None provided'}

**Their Top/Recent Content:**
${contentList}

Provide a detailed competitive analysis:

## Content Strategy
What topics, formats, and angles do they consistently use? What patterns emerge?

## Posting Cadence
Based on the content provided, estimate their posting frequency and consistency.

## Engagement Tactics
What hooks, CTAs, and engagement strategies do they employ? What gets them the most interaction?

## Strengths
What are they doing well that you should learn from? Be specific.

## Weaknesses & Gaps
Where are they falling short? What topics or formats are they missing? These are your opportunities.

## Actionable Takeaways
5 specific things to implement in your own strategy based on this analysis. Be concrete — not "post more consistently" but specific content ideas and tactics.`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6-20250514',
      max_tokens: 3000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    return NextResponse.json({ content: text });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Analysis failed';
    const status = message.includes('authentication') || message.includes('API key') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
