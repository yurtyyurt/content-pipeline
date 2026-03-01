import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { apiKey, brainContext, topContent, competitors, currentPipeline } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'Claude API key is required. Add it in Settings.' }, { status: 400 });
    }

    const client = new Anthropic({ apiKey });

    const topContentSection = topContent?.length
      ? topContent
          .map(
            (c: { title: string; platform: string; contentType: string; metrics: Record<string, unknown> }, i: number) =>
              `${i + 1}. "${c.title}" (${c.platform} / ${c.contentType}) — Metrics: ${JSON.stringify(c.metrics)}`
          )
          .join('\n')
      : 'No performance data available yet.';

    const competitorsSection = competitors?.length
      ? competitors
          .map(
            (c: { handle: string; platform: string; niche: string }, i: number) =>
              `${i + 1}. @${c.handle} on ${c.platform} (${c.niche})`
          )
          .join('\n')
      : 'No competitors tracked yet.';

    const pipelineSection = currentPipeline
      ? Object.entries(currentPipeline)
          .map(([stage, count]) => `${stage}: ${count}`)
          .join(', ')
      : 'No pipeline data.';

    const systemPrompt = `You are an elite content strategist who generates highly targeted content ideas. You have deep context about this creator and their performance data. Generate ideas that are timely, platform-optimized, and designed to outperform their previous content. Every suggestion must be specific and ready to execute.

${brainContext || ''}`;

    const userPrompt = `Based on everything you know about this creator, generate exactly 5 content suggestions.

**Top Performing Content:**
${topContentSection}

**Competitors Being Tracked:**
${competitorsSection}

**Current Pipeline Status:**
${pipelineSection}

For each suggestion, provide:

1. **Title** — Compelling and specific, not generic
2. **Platform** — TikTok or X (choose whichever would work best for this idea)
3. **Content Type** — script / thread / post / hook / concept
4. **Why This Will Work** — Reference their data, audience insights, or competitor gaps
5. **Hook** — The exact first line or opening that stops the scroll
6. **Priority** — high / medium / low (based on timeliness and potential impact)

Number each suggestion 1-5. Be specific and actionable — every idea should be ready to move into production immediately.`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6-20250514',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    return NextResponse.json({ content: text });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Suggestion generation failed';
    const status = message.includes('authentication') || message.includes('API key') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
